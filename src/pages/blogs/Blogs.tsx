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

export function Blogs() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  
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

  const rows = blogs.map((blog) => (
    <Table.Tr key={blog.id}>
      <Table.Td>
        <Group gap="sm">
          <Box w={50} h={50} style={{ overflow: 'hidden', borderRadius: '4px' }}>
            {blog.coverImage ? (
              <Image
                src={blog.coverImage}
                alt={blog.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Paper
                w="100%"
                h="100%"
                bg="gray.1"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconPhoto style={{ width: rem(20), height: rem(20) }} color="gray" />
              </Paper>
            )}
          </Box>
          <div>
            <Text size="sm" fw={500}>
              {blog.title}
            </Text>
            {blog.description && (
              <Text size="xs" c="dimmed" lineClamp={2}>
                {blog.description}
              </Text>
            )}
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="sm">
          {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => navigate(`/blogs/${blog.id}/edit`)}
          >
            <IconEdit style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
          <Menu position="bottom-end" withinPortal>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                color="red"
                leftSection={
                  <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                onClick={() => handleDelete(blog.id)}
              >
                Xóa
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box p="md">
      <LoadingOverlay visible={loading} />

      <Stack gap="md">
        <Group justify="space-between">
          <Group>
            <TextInput
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPagination(prev => ({ ...prev, currentPage: 1 }));
                }
              }}
            />
            <Select
              placeholder="Sắp xếp theo"
              value={sortBy}
              onChange={(value) => {
                setSortBy(value || 'createdAt');
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              data={[
                { value: 'createdAt', label: 'Ngày tạo' },
                { value: 'title', label: 'Tiêu đề' },
              ]}
            />
            <Select
              placeholder="Thứ tự"
              value={sortOrder}
              onChange={(value) => {
                setSortOrder(value as 'ASC' | 'DESC');
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              data={[
                { value: 'DESC', label: 'Giảm dần' },
                { value: 'ASC', label: 'Tăng dần' },
              ]}
            />
            <Switch
              label="Hiện bài đã xóa"
              checked={includeDeleted}
              onChange={(e) => {
                setIncludeDeleted(e.currentTarget.checked);
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
            />
          </Group>
          <Button
            leftSection={<IconPlus size={14} />}
            onClick={() => navigate('/blogs/create')}
          >
            Thêm bài viết
          </Button>
        </Group>

        <Paper shadow="xs" p="md" pos="relative">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Tiêu đề</Table.Th>
                <Table.Th>Ngày tạo</Table.Th>
                <Table.Th style={{ width: rem(120) }}>Thao tác</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {blogs.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={3} align="center">
                    <Text c="dimmed">Không có dữ liệu</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                rows
              )}
            </Table.Tbody>
          </Table>

          {pagination.totalPages > 1 && (
            <Group justify="center" mt="md">
              <Pagination
                value={pagination.currentPage}
                onChange={(page) => fetchBlogs(page)}
                total={pagination.totalPages}
              />
            </Group>
          )}
        </Paper>
      </Stack>
    </Box>
  );
}
