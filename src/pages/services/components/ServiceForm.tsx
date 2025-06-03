import { Modal, TextInput, NumberInput, Button, Group, Select, Image, Text, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IService } from '../../../interfaces/service.interface';
import { ICategory } from '../../../interfaces/category.interface';
import { serviceService } from '../../../services/service.service';
import { useEffect, useState } from 'react';
import { ImageUpload } from '../../../components/ImageUpload';
import { categoryService } from '../../../services/category.service';
import { uploadService } from '../../../services/upload.service';
import { useMediaQuery } from '@mantine/hooks';
import { ServiceFormProps } from '../../../interfaces/service.interface';

export function ServiceForm({ opened, onClose, service }: ServiceFormProps) {
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const form = useForm<IService>({
    initialValues: {
      name: '',
      description: '',
      duration: 60,
      coverImage: '',
      categoryId: '',
    },
  });

  useEffect(() => {
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

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      form.setFieldValue('coverImage', '');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadService.uploadImage(formData);
      form.setFieldValue('coverImage', res.data.url);
    } catch (err) {
      console.log(err);
      throw err;
    }
    setUploading(false);
  };

  const handleSubmit = async (values: IService) => {
    try {
      const { name, description, duration, coverImage, categoryId } = values;
      const payload = { name, description, duration, coverImage, categoryId, price: 1, discount: 1 };
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
        <Stack gap="md">
          <TextInput label="Tên dịch vụ" required {...form.getInputProps('name')} style={isMobile ? { width: '100%' } : {}} />
          <TextInput label="Mô tả" mt="md" {...form.getInputProps('description')} style={isMobile ? { width: '100%' } : {}} />
          <NumberInput label="Thời lượng (phút)" required mt="md" {...form.getInputProps('duration')} style={isMobile ? { width: '100%' } : {}} />
          <ImageUpload 
            onChange={handleImageChange} 
            uploading={uploading}
            initialImage={service?.coverImage}
          />
          <Select
            label="Danh mục"
            required
            mt="md"
            data={categories}
            placeholder="Chọn danh mục"
            {...form.getInputProps('categoryId')}
            style={isMobile ? { width: '100%' } : {}}
          />
          <Group justify="flex-end" mt="xl" style={isMobile ? { flexDirection: 'column', gap: 8 } : {}}>
            <Button type="submit" fullWidth={isMobile}>
              Lưu
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
} 