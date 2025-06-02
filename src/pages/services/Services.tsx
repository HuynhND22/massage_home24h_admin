import { useEffect, useState } from 'react';
import { Container, Title, Button, Group, LoadingOverlay, Paper } from '@mantine/core';
import { serviceService, IService } from '../../services/service.service';
import { categoryService, ICategory } from '../../services/category.service';
import { ServiceList } from './components/ServiceList';
import { ServiceForm } from './components/ServiceForm';

export function Services() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(false);
  const [openedForm, setOpenedForm] = useState(false);
  const [editingService, setEditingService] = useState<IService | null>(null);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await serviceService.getAll({ page: 1, limit: 10 });
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
      const map: Record<string, string> = {};
      items.forEach((c: ICategory) => { map[c.id] = c.name; });
      setCategoryMap(map);
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

  return (
    <Container size="xl">
      <Title order={2} mb="xl">Quản lý dịch vụ</Title>
      <Group justify="flex-end" mb="md">
        <Button onClick={handleCreate}>Thêm dịch vụ</Button>
      </Group>
      <Paper p="md" pos="relative">
        <LoadingOverlay visible={loading} />
        <ServiceList services={services} onEdit={handleEdit} onRefresh={fetchServices} categoryMap={categoryMap} />
      </Paper>
      <ServiceForm opened={openedForm} onClose={handleFormClose} service={editingService} />
    </Container>
  );
} 