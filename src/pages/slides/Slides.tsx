import { useEffect, useState } from 'react';
import { Container, Title, Button, Group, LoadingOverlay } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { slideService } from '../../services/slide.service';
import SlideListPage from './components/SlideListPage';
import { SlideForm } from './components/SlideForm';
import { notifications } from '@mantine/notifications';
import { ISlide } from '../../interfaces/slide.interface';

export default function Slides() {
  const [slides, setSlides] = useState<ISlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [openedForm, setOpenedForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<ISlide | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const data = await slideService.getAll({ page: 1, limit: 1000 });
      setSlides(data.items || data);
    } catch (error) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleEdit = (slide: ISlide) => {
    setEditingSlide(slide);
    setOpenedForm(true);
  };

  const handleCreate = () => {
    setEditingSlide(null);
    setOpenedForm(true);
  };

  const handleFormClose = (refresh = false) => {
    setOpenedForm(false);
    setEditingSlide(null);
    if (refresh) fetchSlides();
  };

  const handleDeleteMany = async () => {
    if (selectedIds.length === 0) return;
    try {
      setLoading(true);
      await Promise.all(selectedIds.map(id => slideService.delete(id)));
      notifications.show({ title: 'Thành công', message: 'Đã xóa các banner đã chọn', color: 'green' });
      setSelectedIds([]);
      fetchSlides();
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Không thể xóa banner', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xl">
      <Title order={2} mb="xl">Quản lý banner</Title>
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
      <SlideListPage
        data={slides}
        onEdit={handleEdit}
        onRefresh={fetchSlides}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
      <SlideForm opened={openedForm} onClose={handleFormClose} slide={editingSlide} />
    </Container>
  );
} 