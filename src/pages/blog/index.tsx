import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Group,
  Button,
  TextInput,
  Card,
  Badge,
  Table,
  Image,
  LoadingOverlay,
  ActionIcon,
  Stack,
  Center,
  Grid,
  Select,
  Switch,
} from '@mantine/core';
import { showSuccessNotification } from '../../utils/notificationUtils';
import { handleApiError } from '../../utils/errorHandling';
import { modals } from '@mantine/modals';
import {
  IconEdit,
  IconTrash,
  IconSearch,
  IconPlus,
} from '@tabler/icons-react';
import { blogService } from '../../services/blog.service';
import { formatDate } from '../../utils/formatters';
import { useDebouncedState, useMediaQuery } from '../../hooks';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  slug: string;
  author: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  translations: {
    id: number;
    language: string;
    title: string;
    content: string;
    postId: number;
  }[];
  category: {
    id: number;
    name: string;
  } | null;
}

export default function Posts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useDebouncedState('', 300);
  const [language, setLanguage] = useState('');
  const [publishedOnly, setPublishedOnly] = useState(false);
  const [page] = useState(1);
  const [, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const { isMobile } = useMediaQuery();

  // Tải danh sách bài viết
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllPosts(
        page, 
        limit, 
        language || undefined, 
        publishedOnly
      );
      setPosts(response.data.data.posts);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      handleApiError(error, 'Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  }, [page, limit, language, publishedOnly, setLoading, setPosts, setTotalPages]);

  // Tải dữ liệu khi component được mount hoặc các tham số thay đổi
  useEffect(() => {
    fetchPosts();
  }, [page, language, publishedOnly, fetchPosts]);

  // Xóa bài viết
  const handleDelete = (id: number) => {
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
          setLoading(true);
          await blogService.deletePost(id);
          showSuccessNotification('Xóa bài viết', 'Đã xóa bài viết thành công');
          fetchPosts();
        } catch (error) {
          handleApiError(error, 'Không thể xóa bài viết');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Cập nhật trạng thái xuất bản
  const togglePublishStatus = async (id: number, currentStatus: boolean) => {
    try {
      setLoading(true);
      await blogService.togglePublishStatus(id);
      showSuccessNotification(
        'Cập nhật trạng thái', 
        currentStatus ? 'Đã hủy xuất bản bài viết' : 'Đã xuất bản bài viết'
      );
      fetchPosts();
    } catch (error) {
      handleApiError(error, 'Không thể cập nhật trạng thái xuất bản');
    } finally {
      setLoading(false);
    }
  };
  
  // Lọc bài viết theo từ khóa tìm kiếm
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchInput.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchInput.toLowerCase()) ||
    (post.author && post.author.toLowerCase().includes(searchInput.toLowerCase()))
  );

  return (
    <Container size="xl">
      <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
      
      <Group mb="md" justify="space-between">
        <Title order={2}>Quản lý bài viết</Title>
        
        <Button 
          leftSection={<IconPlus size={16} />}
          onClick={() => navigate('/blog/create')}
          variant="gradient" 
          gradient={{ from: 'teal', to: 'blue', deg: 60 }}
        >
          Thêm bài viết mới
        </Button>
      </Group>
      
      <Card shadow="sm" p="lg" radius="md" mb="xl">
        <Grid align="center">
          <Grid.Col span={isMobile ? 12 : 8}>
            <TextInput
              placeholder="Tìm kiếm bài viết..."
              leftSection={<IconSearch size={16} />}
              value={searchInput}
              onChange={(event) => setSearchInput(event.currentTarget.value as string)}
            />
          </Grid.Col>
          <Grid.Col span={isMobile ? 12 : 4}>
            <Group justify={isMobile ? "space-between" as const : "flex-end" as const} wrap="nowrap">
              <Select
                placeholder="Chọn ngôn ngữ"
                clearable
                value={language}
                onChange={(value) => setLanguage(value || '')}
                data={[
                  { value: '', label: 'Tất cả' },
                  { value: 'vi', label: 'Tiếng Việt' },
                  { value: 'en', label: 'Tiếng Anh' },
                  { value: 'zh', label: 'Tiếng Trung' },
                  { value: 'ko', label: 'Tiếng Hàn' },
                ]}
                style={{ width: isMobile ? '45%' : '150px' }}
              />
              <Switch
                label="Chỉ đã xuất bản"
                checked={publishedOnly}
                onChange={(event) => setPublishedOnly(event.currentTarget.checked)}
              />
            </Group>
          </Grid.Col>
        </Grid>
      </Card>
      
      {filteredPosts.length === 0 ? (
        <Center style={{ height: '200px' }}>
          <Stack align="center">
            <Text size="xl" fw={500} c="dimmed">Không có bài viết nào</Text>
            <Button 
              leftSection={<IconPlus size={16} />}
              onClick={() => navigate('/blog/create')}
            >
              Thêm bài viết mới
            </Button>
          </Stack>
        </Center>
      ) : (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '60px' }}>ID</Table.Th>
              <Table.Th style={{ width: '80px' }}>Hình ảnh</Table.Th>
              <Table.Th>Tiêu đề</Table.Th>
              <Table.Th>Danh mục</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th style={{ width: '120px' }}>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredPosts.map((post) => (
              <Table.Tr key={post.id}>
                <Table.Td>{post.id}</Table.Td>
                <Table.Td>
                  <Image
                    radius="md"
                    src={post.image}
                    h={60}
                    w={60}
                    fit="cover"
                    fallbackSrc="https://placehold.co/60x60?text=Image"
                  />
                </Table.Td>
                <Table.Td>
                  <Text fw={500}>{post.title}</Text>
                  <Text size="xs" c="dimmed" lineClamp={2}>
                    {post.excerpt}
                  </Text>
                </Table.Td>
                <Table.Td>{post.category?.name || 'Không có'}</Table.Td>
                <Table.Td>{formatDate(post.createdAt)}</Table.Td>
                <Table.Td>
                  <Badge 
                    color={post.isPublished ? 'teal' : 'gray'} 
                    variant="filled"
                    style={{ cursor: 'pointer' }}
                    onClick={() => togglePublishStatus(post.id, post.isPublished)}
                  >
                    {post.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon 
                      color="blue" 
                      onClick={() => navigate(`/blog/edit/${post.id}`)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon 
                      color="red" 
                      onClick={() => handleDelete(post.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Container>
  );
}
