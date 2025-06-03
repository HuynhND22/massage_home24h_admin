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
import { categoryService } from '../../../services/category.service';
import { ImageUpload } from '../../../components/ImageUpload';
import { useMediaQuery } from '@mantine/hooks';
import { ICategory ,CategoryFormProps } from '../../../interfaces/category.interface';

export function CategoryForm({ opened, onClose, category }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 600px)');

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
      imageFile: null as File | null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);

      const categoryData: Partial<ICategory> & { imageFile?: File } = {
        name: values.name.trim(),
        description: values.description?.trim() || '',
        type: values.type as 'blog' | 'service',
        coverImage: values.coverImage || '',
        imageFile: values.imageFile || undefined,
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
    form.setFieldValue('imageFile', file);
    if (file) {
      setUploading(true);
      // Create a temporary URL for the preview
      const imageUrl = URL.createObjectURL(file);
      form.setFieldValue('coverImage', imageUrl);
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
          style={isMobile ? { width: '100%' } : {}}
        />
        <TextInput
          required
          label="Tên danh mục"
          placeholder="Nhập tên danh mục"
          {...form.getInputProps('name')}
          style={isMobile ? { width: '100%' } : {}}
        />

        <Textarea
          label="Mô tả"
          placeholder="Nhập mô tả danh mục"
          {...form.getInputProps('description')}
          style={isMobile ? { width: '100%' } : {}}
        />

        <ImageUpload 
          onChange={handleImageChange} 
          uploading={uploading}
          initialImage={category?.coverImage}
        />

        <Switch
          label="Kích hoạt"
          {...form.getInputProps('status', { type: 'checkbox' })}
        />

        <Group justify="flex-end" style={isMobile ? { flexDirection: 'column', gap: 8 } : {}}>
          <Button type="submit" loading={loading} fullWidth={isMobile}>
            {category ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 