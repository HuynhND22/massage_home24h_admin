import { useEffect, useState } from 'react';
import { Container, Title, Button, Group, LoadingOverlay, Paper } from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { serviceService } from '../../services/service.service';
import { categoryService } from '../../services/category.service';
import ServiceListPage from './components/ServiceListPage';
import { ServiceForm } from './components/ServiceForm';
import { notifications } from '@mantine/notifications';
import { IService } from '../../interfaces/service.interface';
import { ICategory } from '../../interfaces/category.interface';

export function Services() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(false);
  const [openedForm, setOpenedForm] = useState(false);
  const [editingService, setEditingService] = useState<IService | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await serviceService.getAll({ page: 1, limit: 1000 });
      setServices(data.items || data);
    } catch (error) {
      // handle error
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAll({ limit: 100 });
      const items = res.data?.items || res.data || [];
      setCategories(items);
    } catch {}
  };

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const handleEdit = (service: IService) => {
    setEditingService(service);
    setOpenedForm(true);
  };

  const handleCreate = () => {
    setEditingService(null);
    setOpenedForm(true);
  };

  const handleFormClose = (refresh = false) => {
    setOpenedForm(false);
    setEditingService(null);
    if (refresh) fetchServices();
  };

  const handleDeleteMany = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      await Promise.all(selectedIds.map(id => serviceService.delete(id)));
      notifications.show({ title: 'Thành công', message: 'Đã xóa các dịch vụ đã chọn', color: 'green' });
      setSelectedIds([]);
      fetchServices();
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Không thể xóa dịch vụ', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xl">
      <Title order={2} mb="xl">Quản lý dịch vụ</Title>
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
        <Button leftSection={<IconPlus size={16} />} color="green" variant="filled" onClick={handleCreate}>
          Thêm mới
        </Button>
      </Group>
      
        <LoadingOverlay visible={loading} />
        <ServiceListPage
          data={services}
          categories={categories}
          onEdit={handleEdit}
          onRefresh={fetchServices}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      
      <ServiceForm opened={openedForm} onClose={handleFormClose} service={editingService} />
    </Container>
  );
} 