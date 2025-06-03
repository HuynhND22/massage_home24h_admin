import { Modal, TextInput, NumberInput, Button, Group, Select, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ISlide } from '../../../interfaces/slide.interface';
import { slideService } from '../../../services/slide.service';
import { useEffect, useState } from 'react';
import { ImageUpload } from '../../../components/ImageUpload';
import { uploadService } from '../../../services/upload.service';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';
import { SlideFormProps } from '../../../interfaces/slide.interface';

export function SlideForm({ opened, onClose, slide }: SlideFormProps) {
  const [uploading, setUploading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const form = useForm<ISlide>({
    initialValues: {
      title: '',
      description: '',
      image: '',
      role: '',
      order: 0,
    },
  });

  useEffect(() => {
    if (slide) {
      form.setValues(slide);
    } else {
      form.reset();
    }
  }, [slide, opened]);

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      form.setFieldValue('image', '');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadService.uploadImage(formData);
      form.setFieldValue('image', res.data.url);
    } catch (err) {
      console.error('Lỗi upload ảnh:', err);
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể tải lên ảnh',
        color: 'red',
      });
    }
    setUploading(false);
  };

  const handleSubmit = async (values: ISlide) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        image: values.image,
        role: values.role,
        order: values.order,
      };
      if (slide && slide.id) {
        await slideService.update(slide.id, payload);
        notifications.show({
          title: 'Thành công',
          message: 'Đã cập nhật slide',
          color: 'green',
        });
      } else {
        await slideService.create(payload);
        notifications.show({
          title: 'Thành công',
          message: 'Đã tạo slide mới',
          color: 'green',
        });
      }
      onClose(true);
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể lưu slide',
        color: 'red',
      });
    }
  };

  return (
    <Modal opened={opened} onClose={() => onClose()} title={slide ? 'Sửa slide' : 'Thêm slide'}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput 
            label="Tiêu đề" 
            required 
            placeholder="Nhập tiêu đề slide"
            {...form.getInputProps('title')} 
            style={isMobile ? { width: '100%' } : {}}
          />
          <TextInput 
            label="Mô tả" 
            placeholder="Nhập mô tả slide"
            {...form.getInputProps('description')} 
            style={isMobile ? { width: '100%' } : {}}
          />
          <ImageUpload 
            onChange={handleImageChange} 
            uploading={uploading}
            initialImage={slide?.image}
          />
          <Select
            label="Vị trí hiển thị"
            required
            placeholder="Chọn vị trí hiển thị của slide"
            data={[
              { value: 'home', label: 'Trang chủ' },
              { value: 'about', label: 'Giới thiệu' },
              { value: 'service', label: 'Dịch vụ' },
            ]}
            {...form.getInputProps('role')}
            style={isMobile ? { width: '100%' } : {}}
          />
          <NumberInput 
            label="Thứ tự" 
            placeholder="Nhập thứ tự hiển thị"
            {...form.getInputProps('order')} 
            style={isMobile ? { width: '100%' } : {}}
          />
          <Group justify="flex-end" mt="xl" style={isMobile ? { flexDirection: 'column', gap: 8 } : {}}>
            <Button type="submit" fullWidth={isMobile}>Lưu</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
} 