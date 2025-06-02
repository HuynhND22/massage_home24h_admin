import { useState } from 'react';
import {
  TextInput,
  Textarea,
  Switch,
  Stack,
  Button,
  Group,
  FileInput,
  Image,
  Select
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { categoryService, ICategory } from '../../services/category.service';

interface CategoryFormProps {
  initialValues?: ICategory;
  onSuccess: () => void;
}

export function CategoryForm({ initialValues, onSuccess }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      coverImage: initialValues?.coverImage || '',
      type: initialValues?.type || 'service',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);

      if (imageFile && imageFile.size > 5 * 1024 * 1024) {
        throw new Error('Kích thước ảnh không được vượt quá 5MB');
      }

      const categoryData: Partial<ICategory> & { imageFile?: File, deleteImage?: boolean } = {
        name: values.name.trim(),
        description: values.description?.trim() || '',
        type: values.type as 'blog' | 'service',
        coverImage: values.coverImage || '',
        imageFile: imageFile || undefined
      };

      if (initialValues?.id) {
        // Nếu có ảnh cũ và đang upload ảnh mới, xóa ảnh cũ
        if (initialValues.coverImage && imageFile) {
          categoryData.deleteImage = true;
        }
        await categoryService.update(initialValues.id, categoryData);
      } else {
        const response = await categoryService.create(categoryData);
        if (!response.data) {
          throw new Error('Không thể tạo danh mục');
        }
      }

      notifications.show({
        title: 'Thành công',
        message: initialValues ? 'Đã cập nhật danh mục' : 'Đã tạo danh mục mới',
        color: 'green',
      });

      onSuccess();
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

        <FileInput
          label="Hình ảnh"
          placeholder="Chọn hình ảnh"
          accept="image/*"
          onChange={setImageFile}
        />

        {(form.values.coverImage || imageFile) && (
          <Group mt="lg">
            <Image
              src={imageFile ? URL.createObjectURL(imageFile) : form.values.coverImage}
              width={200}
              height={120}
              fit="contain"
              radius="md"
            />
          </Group>
        )}

        <Switch
          label="Kích hoạt"
          {...form.getInputProps('status', { type: 'checkbox' })}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {initialValues ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
