import { useState } from 'react';
import {
  TextInput,
  Textarea,
  Switch,
  Stack,
  Button,
  Group,
  Select,
  Tabs
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { categoryService } from '../../../services/category.service';
import { ImageUpload } from '../../../components/ImageUpload';
import { useMediaQuery } from '@mantine/hooks';
import { ICategory, CategoryFormProps, CategoryTranslation } from '../../../interfaces/category.interface';

const LANGS = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
  { value: 'ko', label: '한국어' },
  { value: 'zh', label: '中文' },
];

export function CategoryForm({ onClose, category }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [activeLang, setActiveLang] = useState('vi');

  // Init translations state
  const [translations, setTranslations] = useState<CategoryTranslation[]>(() => {
    let result = category?.translations
      ? category.translations.map(t => ({
          language: t.language,
          name: t.name || '',
          description: t.description || '',
        }))
      : [];
    LANGS.forEach(lang => {
      if (!result.find(t => t.language === lang.value)) {
        result.push({ language: lang.value, name: '', description: '' });
      }
    });
    return result;
  });

  const form = useForm({
    validate: {
      type: (value) => !value ? 'Loại danh mục là bắt buộc' : null,
    },
    initialValues: {
      coverImage: category?.coverImage || '',
      type: category?.type || 'service',
      imageFile: null as File | null,
    },
  });

  const handleTranslationChange = (lang: string, field: 'name' | 'description', value: string) => {
    setTranslations(prev => prev.map(t => t.language === lang ? { ...t, [field]: value } : t));
  };

  function slugify(str: string) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[ -\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      const translationsToSend = translations.map(t => ({
        language: t.language,
        name: t.name.trim(),
        description: t.description?.trim() || '',
      }));
      const viTranslation = translations.find(t => t.language === 'vi') || translations[0];
      const name = viTranslation?.name?.trim() || '';
      const description = viTranslation?.description?.trim() || '';
      const slug = slugify(name);
      const categoryData: Partial<ICategory> & { imageFile?: File } = {
        name,
        slug,
        description,
        type: values.type as 'blog' | 'service',
        coverImage: values.coverImage || '',
        imageFile: values.imageFile || undefined,
        translations: translationsToSend,
      };
      console.log('categoryData gửi lên:', categoryData);
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
      if (error?.response) {
        console.log('Lỗi backend trả về:', error.response.data);
      }
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
                label={`Tên danh mục (${LANGS.find(l => l.value === t.language)?.label || t.language})`}
                placeholder={`Nhập tên danh mục (${LANGS.find(l => l.value === t.language)?.label || t.language})`}
                value={t.name}
                onChange={e => handleTranslationChange(t.language, 'name', e.target.value)}
                style={isMobile ? { width: '100%' } : {}}
              />
              <Textarea
                label={`Mô tả (${LANGS.find(l => l.value === t.language)?.label || t.language})`}
                placeholder={`Nhập mô tả (${LANGS.find(l => l.value === t.language)?.label || t.language})`}
                value={t.description}
                onChange={e => handleTranslationChange(t.language, 'description', e.target.value)}
                style={isMobile ? { width: '100%' } : {}}
              />
            </Tabs.Panel>
          ))}
        </Tabs>
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