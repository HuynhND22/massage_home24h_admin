import { useState } from 'react';
import {
  TextInput,
  Textarea,
  Switch,
  Stack,
  Button,
  Group,
  Select
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { categoryService, ICategory } from '../../../services/category.service';
import { ImageUpload } from '../../../components/ImageUpload';

interface CategoryFormProps {
  opened: boolean;
  onClose: (refresh?: boolean) => void;
  category: ICategory | null;
}

export function CategoryForm({ opened, onClose, category }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm({
    validate: {
      name: (value) => {
        if (!value) return 'Tên danh mục là bắt buộc';
        if (value.length < 2) return 'Tên danh mục phải có ít nhất 2 ký tự';
        if (value.length > 100) return 'Tên danh mục không được quá 100 ký tự';
        return null;
      },
      description: (value) => 
        value && value.length > 500 ? 'Mô tả không được quá 500 ký tự' : null,
      type: (value) => !value ? 'Loại danh mục là bắt buộc' : null,
    },
    initialValues: {
      name: category?.name || '',
      description: category?.description || '',
      coverImage: category?.coverImage || '',
      type: category?.type || 'service',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);

      const categoryData: Partial<ICategory> = {
        name: values.name.trim(),
        description: values.description?.trim() || '',
        type: values.type as 'blog' | 'service',
        coverImage: values.coverImage || '',
      };

      if (category?.id) {
        await categoryService.update(category.id, categoryData);
      } else {
        const response = await categoryService.create(categoryData);
        if (!response.data) {
          throw new Error('Không thể tạo danh mục');
        }
      }

      notifications.show({
        title: 'Thành công',
        message: category ? 'Đã cập nhật danh mục' : 'Đã tạo danh mục mới',
        color: 'green',
      });

      onClose(true);
    } catch (error: any) {
      console.error('Error creating/updating category:', error);
      notifications.show({
        title: 'Lỗi',
        message: error.message || 'Không thể lưu danh mục',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setUploading(true);
      setUploading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Select
          required
          label="Loại danh mục"
          placeholder="Chọn loại danh mục"
          data={[
            { value: 'service', label: 'Dịch vụ' },
            { value: 'blog', label: 'Blog' },
          ]}
          {...form.getInputProps('type')}
        />
        <TextInput
          required
          label="Tên danh mục"
          placeholder="Nhập tên danh mục"
          {...form.getInputProps('name')}
        />

        <Textarea
          label="Mô tả"
          placeholder="Nhập mô tả danh mục"
          {...form.getInputProps('description')}
        />

        <ImageUpload onChange={handleImageChange} uploading={uploading} />

        <Switch
          label="Kích hoạt"
          {...form.getInputProps('status', { type: 'checkbox' })}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {category ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 