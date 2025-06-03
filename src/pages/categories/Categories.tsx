import { useEffect, useState } from 'react';
import { Container, Title, Button, Group, LoadingOverlay, Paper, Modal } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { categoryService } from '../../services/category.service';
import { CategoryForm } from './components/CategoryForm';
import CategoryListPage from './components/CategoryListPage';
import { notifications } from '@mantine/notifications';
import { ICategory } from '../../interfaces/category.interface';

export function Categories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [openedForm, setOpenedForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll({ limit: 100 });
      const items = res.data?.items || res.data || [];
      setCategories(items);
    } catch (error) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setOpenedForm(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setOpenedForm(true);
  };

  const handleFormClose = (refresh = false) => {
    setOpenedForm(false);
    setEditingCategory(null);
    if (refresh) fetchCategories();
  };

  const handleDeleteMany = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      await Promise.all(selectedIds.map(id => categoryService.delete(id)));
      notifications.show({ title: 'Thành công', message: 'Đã xóa các danh mục đã chọn', color: 'green' });
      setSelectedIds([]);
      fetchCategories();
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Không thể xóa danh mục', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xl">
      <Title order={2} mb="xl">Quản lý danh mục</Title>
      <Group justify="flex-end" mb="md">
        <Button
          leftSection={<IconTrash size={16} />}
          color="red"
          variant="outline"
          disabled={selectedIds.length === 0}
          onClick={handleDeleteMany}
        >
          Xóa hàng loạt
        </Button>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
          Thêm mới
        </Button>
      </Group>
      
        <LoadingOverlay visible={loading} />
        <CategoryListPage
          data={categories}
          onEdit={handleEdit}
          onRefresh={fetchCategories}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      
      <Modal
        opened={openedForm}
        onClose={() => setOpenedForm(false)}
        title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}
        size="lg"
        centered
      >
        <CategoryForm
          opened={openedForm}
          onClose={handleFormClose}
          category={editingCategory}
        />
      </Modal>
    </Container>
  );
}
