import { Modal, TextInput, NumberInput, Button, Group, Select, Stack, Tabs, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { SlideTranslation, SlideFormProps } from '../../../interfaces/slide.interface';
import { slideService } from '../../../services/slide.service';
import { useEffect, useState } from 'react';
import { ImageUpload } from '../../../components/ImageUpload';
import { uploadService } from '../../../services/upload.service';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';

const LANGS = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
  { value: 'ko', label: '한국어' },
  { value: 'zh', label: '中文' },
];

export function SlideForm({ opened, onClose, slide }: SlideFormProps) {
  const [uploading, setUploading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [activeLang, setActiveLang] = useState('vi');

  // Init translations state
  const [translations, setTranslations] = useState<SlideTranslation[]>(() => {
    let result = slide?.translations
      ? slide.translations.map(t => ({
          language: t.language,
          title: t.title || '',
          description: t.description || '',
        }))
      : [];
    LANGS.forEach(lang => {
      if (!result.find(t => t.language === lang.value)) {
        result.push({ language: lang.value, title: '', description: '' });
      }
    });
    return result;
  });

  const form = useForm({
    initialValues: {
      image: slide?.image || '',
      role: slide?.role || '',
      order: slide?.order || 1,
    },
  });

  useEffect(() => {
    if (slide) {
      form.setValues({
        image: slide.image,
        role: slide.role,
        order: slide.order || 1,
      });
      setTranslations(
        slide.translations
          ? LANGS.map(lang => {
              const exist = slide.translations?.find(t => t.language === lang.value);
              return {
                language: lang.value,
                title: exist?.title || '',
                description: exist?.description || '',
              };
            })
          : LANGS.map(lang => ({ language: lang.value, title: '', description: '' }))
      );
    } else {
      form.reset();
      setTranslations(LANGS.map(lang => ({ language: lang.value, title: '', description: '' })));
    }
    // eslint-disable-next-line
  }, [slide, opened]);

  const handleTranslationChange = (lang: string, field: 'title' | 'description', value: string) => {
    setTranslations(prev => prev.map(t => t.language === lang ? { ...t, [field]: value } : t));
  };

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      form.setFieldValue('image', '');
      return;
    }
    setUploading(true);
    let timeoutId: any;
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Promise timeout 10s
      const timeoutPromise = new Promise((_, reject) =>
        timeoutId = setTimeout(() => reject(new Error('Upload ảnh quá lâu, vui lòng thử lại!')), 10000)
      );

      // Race upload vs timeout
      const res = await Promise.race([
        uploadService.uploadImage(formData),
        timeoutPromise
      ]);

      // Nếu upload thành công
      // @ts-ignore
      form.setFieldValue('image', res.data.url);
    } catch (err: any) {
      notifications.show({
        title: 'Lỗi',
        message: err.message || 'Không thể tải lên ảnh',
        color: 'red',
      });
      form.setFieldValue('image', '');
    } finally {
      clearTimeout(timeoutId);
      setUploading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // Validate image
      if (!values.image) {
        notifications.show({ title: 'Lỗi', message: 'Vui lòng chọn ảnh!', color: 'red' });
        return;
      }
      // Validate role
      if (!values.role || !['home', 'blog'].includes(values.role)) {
        notifications.show({ title: 'Lỗi', message: 'Vui lòng chọn vị trí hiển thị hợp lệ!', color: 'red' });
        return;
      }
      // Build translations array, ensure at least one vi with non-empty title
      const translationsToSend = translations
        .filter(t => t.title.trim() !== '')
        .map(t => ({
          language: t.language,
          title: t.title.trim(),
          description: t.description?.trim() || '',
        }));
      const hasVi = translationsToSend.some(t => t.language === 'vi' && t.title);
      if (!hasVi) {
        notifications.show({ title: 'Lỗi', message: 'Phải nhập tiêu đề tiếng Việt!', color: 'red' });
        return;
      }
      const payload = {
        image: values.image,
        role: values.role,
        order: Number(values.order) || 1,
        translations: translationsToSend,
      };
      console.log('SlideForm payload:', payload);
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
          <Tabs value={activeLang} onChange={(val) => setActiveLang(val as string)}>
            <Tabs.List>
              {translations.map(t => (
                <Tabs.Tab value={t.language} key={t.language}>
                  {LANGS.find(l => l.value === t.language)?.label || t.language}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            {translations.map(t => (
              <Tabs.Panel value={t.language} key={t.language} pt="xs">
                <TextInput
                  required={t.language === 'vi'}
                  label={`Tiêu đề (${LANGS.find(l => l.value === t.language)?.label || t.language})`}
                  value={t.title}
                  onChange={e => handleTranslationChange(t.language, 'title', e.target.value)}
                  style={isMobile ? { width: '100%' } : {}}
                />
                <Textarea
                  label={`Mô tả (${LANGS.find(l => l.value === t.language)?.label || t.language})`}
                  value={t.description}
                  onChange={e => handleTranslationChange(t.language, 'description', e.target.value)}
                  style={isMobile ? { width: '100%' } : {}}
                />
              </Tabs.Panel>
            ))}
          </Tabs>
          {activeLang === 'vi' && (
            <ImageUpload 
              onChange={handleImageChange} 
              uploading={uploading}
              initialImage={slide?.image}
            />
          )}
          <Select
            label="Vị trí hiển thị"
            required
            placeholder="Chọn vị trí hiển thị của slide"
            data={[
              { value: 'home', label: 'Trang chủ' },
              { value: 'blog', label: 'Blog' },
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