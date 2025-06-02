import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Group,
  Text,
  ActionIcon,
  Menu,
  rem,
  Button,
  Switch,
  Stack,
  Grid,
  Select,
  Pagination,
  LoadingOverlay,
  Box,
  Paper,
  Image,
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
import { categoryService, ICategory } from '../../services/category.service';
import { CategoryForm } from './CategoryForm';
import { useAuth } from '../../contexts/AuthContext';

export function Categories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'blog' | 'service'>('service');
  const [showDeleted, setShowDeleted] = useState(false);
  const [status, setStatus] = useState<boolean | undefined>(undefined);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });

  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);
      const response = await categoryService.getAll({ 
        page,
        limit: pagination.itemsPerPage,
        type: type.toLowerCase(),
        status,
        isDeleted: showDeleted
      });
      
      const { items = [], meta = {} } = response.data || {};
      
      setCategories(items);
      setPagination({
        currentPage: meta.currentPage || 1,
        totalPages: meta.totalPages || 1,
        itemsPerPage: meta.itemsPerPage || 10,
        totalItems: meta.totalItems || 0
      });
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể tải danh sách danh mục',
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
    fetchCategories();
  }, [type, isAuthenticated, authLoading, navigate]);

  const handleRestore = async (id: string) => {
    try {
      await categoryService.restore(id);
      notifications.show({
        title: 'Thành công',
        message: 'Đã khôi phục danh mục',
        color: 'green',
      });
      fetchCategories();
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể khôi phục danh mục',
        color: 'red',
      });
    }
  };

  const handleDelete = (id: string) => {
    modals.openConfirmModal({
      title: 'Xác nhận xóa',
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
        </Text>
      ),
      labels: { confirm: 'Xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await categoryService.delete(id);
          notifications.show({
            title: 'Thành công',
            message: 'Đã xóa danh mục',
            color: 'green',
          });
          fetchCategories();
        } catch (error) {
          notifications.show({
            title: 'Lỗi',
            message: 'Không thể xóa danh mục',
            color: 'red',
          });
        }
      },
    });
  };

  const handleEdit = (category: ICategory) => {
    modals.open({
      title: 'Chỉnh sửa danh mục',
      children: (
        <CategoryForm
          initialValues={category}
          onSuccess={() => {
            modals.closeAll();
            fetchCategories();
          }}
        />
      ),
      size: 'lg',
    });
  };

  const handleCreate = () => {
    modals.open({
      title: 'Thêm danh mục mới',
      children: (
        <CategoryForm
          onSuccess={() => {
            modals.closeAll();
            fetchCategories();
          }}
        />
      ),
      size: 'lg',
    });
  };

  const rows = categories.map((category) => (
    <Table.Tr key={category.id}>
      <Table.Td>
        <Group gap="sm">
          <Box
            w={50}
            h={50}
            style={{
              overflow: 'hidden',
              borderRadius: '4px',
            }}
          >
            {category.coverImage ? (
              <Image
                src={category.coverImage}
                alt={category.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
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
                <IconPhoto
                  style={{
                    width: rem(20),
                    height: rem(20),
                    color: 'gray',
                  }}
                  stroke={1.5}
                />
              </Paper>
            )}
          </Box>
          <div>
            <Text fz="sm" fw={500}>
              {category.name}
            </Text>
            <Text fz="xs" c="dimmed">
              {category.type === 'service' ? 'Dịch vụ' : 'Blog'}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>{category.description || '-'}</Table.Td>
      <Table.Td>
        <Text fz="xs" c="dimmed">
          {category.createdAt ? new Date(category.createdAt).toLocaleDateString('vi-VN') : '-'}
        </Text>
      </Table.Td>
      <Table.Td style={{ width: rem(120) }}>
        <Group gap={0} justify="center">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => handleEdit(category)}
          >
            <IconEdit style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
          <Menu
            transitionProps={{ transition: 'pop' }}
            position="bottom-end"
            withinPortal
          >
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {showDeleted ? (
                <Menu.Item
                  onClick={() => handleRestore(category.id!)}
                  leftSection={
                    <IconTrash
                      style={{ width: rem(14), height: rem(14) }}
                      stroke={1.5}
                    />
                  }
                  color="teal"
                >
                  Khôi phục
                </Menu.Item>
              ) : (
                <Menu.Item
                  leftSection={
                    <IconTrash
                      style={{ width: rem(14), height: rem(14) }}
                      stroke={1.5}
                    />
                  }
                  color="red"
                  onClick={() => handleDelete(category.id!)}
                >
                  Xóa
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="md">
      <Paper shadow="xs" p="md">
        <Grid align="center">
          <Grid.Col span={8}>
            <Group align="flex-end">
              <Select
                label="Loại danh mục"
                value={type}
                onChange={(value: string | null) => {
                  if (value) setType(value as 'blog' | 'service');
                }}
                data={[
                  { value: 'service', label: 'Dịch vụ' },
                  { value: 'blog', label: 'Blog' },
                ]}
                style={{ width: 200 }}
              />
              <Select
                label="Trạng thái"
                value={status === undefined ? '' : status.toString()}
                onChange={(value: string | null) => {
                  if (value !== null) setStatus(value === '' ? undefined : value === 'true');
                }}
                data={[
                  { value: '', label: 'Tất cả' },
                  { value: 'true', label: 'Đang hoạt động' },
                  { value: 'false', label: 'Tạm khóa' },
                ]}
                style={{ width: 200 }}
              />
              <Switch
                label="Hiện danh mục đã xóa"
                checked={showDeleted}
                onChange={(event) => setShowDeleted(event.currentTarget.checked)}
              />
            </Group>
          </Grid.Col>
          <Grid.Col span={4} style={{ textAlign: 'right' }}>
            <Button
              variant="filled"
              leftSection={<IconPlus style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              onClick={handleCreate}
            >
              Thêm danh mục
            </Button>
          </Grid.Col>
        </Grid>
      </Paper>

      <Paper shadow="xs" p="md" pos="relative">
        <LoadingOverlay visible={loading} />
        <Box>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Tên</Table.Th>
                <Table.Th>Mô tả</Table.Th>
                <Table.Th>Ngày tạo</Table.Th>
                <Table.Th style={{ width: rem(120) }}>Thao tác</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {categories.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={5} align="center">
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
                onChange={(page) => fetchCategories(page)}
                total={pagination.totalPages}
                size="sm"
              />
              <Text size="sm" c="dimmed">
                Tổng số: {pagination.totalItems} danh mục
              </Text>
            </Group>
          )}
        </Box>
      </Paper>
    </Stack>
  );
}
