import { Modal, TextInput, NumberInput, Button, Group, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IService, serviceService } from '../../../services/service.service';
import { useEffect, useState } from 'react';
import { ImageUpload } from '../../../components/ImageUpload';
import { categoryService, ICategory } from '../../../services/category.service';

interface ServiceFormProps {
  opened: boolean;
  onClose: (refresh?: boolean) => void;
  service: IService | null;
}

export function ServiceForm({ opened, onClose, service }: ServiceFormProps) {
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const form = useForm<IService>({
    initialValues: {
      name: '',
      description: '',
      duration: 60,
      price: 0,
      discount: 0,
      coverImage: '',
      categoryId: '',
    },
  });

  useEffect(() => {
    // Lấy danh sách category khi mở form
    if (opened) {
      categoryService.getAll({ limit: 100 }).then((res) => {
        const items = res.data?.items || res.data || [];
        setCategories(items.map((c: ICategory) => ({ value: c.id, label: c.name })));
      });
    }
    if (service) {
      form.setValues(service);
    } else {
      form.reset();
    }
  }, [service, opened]);

  const handleSubmit = async (values: IService) => {
    try {
      // Chỉ lấy các trường hợp lệ
      const { name, description, duration, price, discount, coverImage, categoryId } = values;
      const payload = { name, description, duration, price, discount, coverImage, categoryId };
      if (service && service.id) {
        await serviceService.update(service.id, payload);
      } else {
        await serviceService.create(payload);
      }
      onClose(true);
    } catch (error) {
      // handle error
    }
  };

  return (
    <Modal opened={opened} onClose={() => onClose()} title={service ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Tên dịch vụ" required {...form.getInputProps('name')} />
        <TextInput label="Mô tả" mt="md" {...form.getInputProps('description')} />
        <NumberInput label="Thời lượng (phút)" required mt="md" {...form.getInputProps('duration')} />
        <NumberInput label="Giá" required mt="md" {...form.getInputProps('price')} />
        <NumberInput label="Giảm giá" mt="md" {...form.getInputProps('discount')} />
        <ImageUpload
          value={form.values.coverImage}
          onChange={(url: string) => form.setFieldValue('coverImage', url)}
        />
        <Select
          label="Danh mục"
          required
          mt="md"
          data={categories}
          placeholder="Chọn danh mục"
          {...form.getInputProps('categoryId')}
        />
        <Group justify="flex-end" mt="xl">
          <Button type="submit">Lưu</Button>
        </Group>
      </form>
    </Modal>
  );
} 