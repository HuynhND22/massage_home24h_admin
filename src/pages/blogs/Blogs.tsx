import { useEffect, useState } from 'react';
import {
  Table,
  Group,
  Text,
  ActionIcon,
  Menu,
  rem,
  Button,
  Stack,
  Pagination,
  LoadingOverlay,
  Box,
  Paper,
  Image,
  TextInput,
  Select,
  Switch,
  Container,
} from '@mantine/core';
import {
  IconDots,
  IconEdit,
  IconTrash,
  IconPlus,
  IconPhoto,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { blogService } from '../../services/blog.service';
import { IBlog } from '../../interfaces/blog.interface';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BlogListPage from './components/BlogListPage';

export function Blogs() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });

  const fetchBlogs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await blogService.getAll({ 
        page,
        limit: pagination.itemsPerPage,
        categoryId,
        search: search || undefined,
        sortBy: sortBy || undefined,
        sortOrder,
      });
      
      console.log('Blog API response:', response);
      
      // Handle different response formats
      let items: IBlog[] = [];
      let meta: { currentPage?: number; totalPages?: number; itemsPerPage?: number; totalItems?: number } = {};
      
      if (response && typeof response === 'object') {
        // Check if response is the direct API response with items and meta
        if (Array.isArray(response.items)) {
          items = response.items;
          meta = response.meta || {};
        } 
        // Check if response has data property (from axios wrapper)
        else if (response.data && typeof response.data === 'object') {
          if (Array.isArray(response.data.items)) {
            items = response.data.items;
            meta = response.data.meta || {};
          } else if (Array.isArray(response.data)) {
            // If data is directly an array
            items = response.data;
          } else {
            console.error('Unexpected response format:', response);
            items = [];
          }
        } else {
          console.error('Unexpected response format:', response);
        }
      }
      
      console.log('Processed items:', items);
      console.log('Processed meta:', meta);
      
      setBlogs(items);
      setPagination({
        currentPage: Number(meta.currentPage) || 1,
        totalPages: Number(meta.totalPages) || 1,
        itemsPerPage: Number(meta.itemsPerPage) || 10,
        totalItems: Number(meta.totalItems) || 0
      });
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể tải danh sách bài viết',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBlogs(pagination.currentPage);
  }, [categoryId, isAuthenticated, authLoading, navigate, search, sortBy, sortOrder, includeDeleted, pagination.currentPage, pagination.itemsPerPage]);

  const handleDelete = (id: string) => {
    modals.openConfirmModal({
      title: 'Xác nhận xóa',
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
        </Text>
      ),
      labels: { confirm: 'Xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await blogService.delete(id);
          notifications.show({
            title: 'Thành công',
            message: 'Đã xóa bài viết',
            color: 'green',
          });
          fetchBlogs();
        } catch (error) {
          notifications.show({
            title: 'Lỗi',
            message: 'Không thể xóa bài viết',
            color: 'red',
          });
        }
      },
    });
  };

  const handleEdit = (blog: IBlog) => {
    navigate(`/blogs/${blog.id}/edit`);
  };

  const handleCreate = () => {
    navigate('/blogs/create');
  };

  const handleDeleteMany = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      await Promise.all(selectedIds.map(id => blogService.delete(id)));
      notifications.show({ title: 'Thành công', message: 'Đã xóa các bài viết đã chọn', color: 'green' });
      setSelectedIds([]);
      fetchBlogs();
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Không thể xóa bài viết', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xl">
      <LoadingOverlay visible={loading} />
      <Stack gap="md">
        <Group justify="flex-end" mb="md">
          <Button
            leftSection={<IconTrash size={16} />}
            color="gray"
            variant="light"
            disabled={selectedIds.length === 0}
            onClick={handleDeleteMany}
          >
            Xóa hàng loạt
          </Button>
          <Button leftSection={<IconPlus size={16} />} color="green" variant="outline" onClick={handleCreate}>
            Thêm mới
          </Button>
        </Group>
        <BlogListPage
          data={blogs}
          categoryOptions={[]}
          onEdit={handleEdit}
          onRefresh={fetchBlogs}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </Stack>
    </Container>
  );
}
