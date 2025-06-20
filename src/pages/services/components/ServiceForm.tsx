import { Modal, TextInput, Button, Group, Select, Stack, Tabs, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IService, ServiceTranslation, ServiceFormProps } from '../../../interfaces/service.interface';
import { ICategory } from '../../../interfaces/category.interface';
import { serviceService } from '../../../services/service.service';
import { useEffect, useState } from 'react';
import { ImageUpload } from '../../../components/ImageUpload';
import { categoryService } from '../../../services/category.service';
import { uploadService } from '../../../services/upload.service';
import { useMediaQuery } from '@mantine/hooks';

const LANGS = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
  { value: 'ko', label: '한국어' },
  { value: 'zh', label: '中文' },
];

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0000-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function ServiceForm({ opened, onClose, service }: ServiceFormProps) {
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [activeLang, setActiveLang] = useState('vi');

  // Init translations state
  const [translations, setTranslations] = useState<ServiceTranslation[]>(() => {
    let result = service?.translations
      ? service.translations.map(t => ({
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

  const form = useForm<IService>({
    initialValues: {
      name: service?.name || '',
      duration: service?.duration || 1,
      coverImage: service?.coverImage || '',
      categoryId: service?.categoryId || '',
      price: service?.price || 1,
      discount: service?.discount || 1,
    },
  });

  useEffect(() => {
    if (opened) {
      categoryService.getAll({ limit: 100 }).then((res) => {
        const items = res.data?.items || res.data?.data || res.data || [];
        setCategories(items.map((c: ICategory) => ({ 
          value: c.id, 
          label: c.name || c.translations?.find(t => t.language === 'vi')?.name || c.translations?.[0]?.name || ''
        })));
      });
    }
    if (service) {
      form.setValues({
        name: service.name,
        duration: service.duration || 1,
        coverImage: service.coverImage,
        categoryId: service.categoryId,
        price: service.price || 1,
        discount: service.discount || 1,
      });
      setTranslations(
        service.translations
          ? LANGS.map(lang => {
              const exist = service.translations?.find(t => t.language === lang.value);
              return {
                language: lang.value,
                name: exist?.name || '',
                description: exist?.description || '',
              };
            })
          : LANGS.map(lang => ({ language: lang.value, name: '', description: '' }))
      );
    } else {
      form.reset();
      setTranslations(LANGS.map(lang => ({ language: lang.value, name: '', description: '' })));
    }
    // eslint-disable-next-line
  }, [service, opened]);

  const handleTranslationChange = (lang: string, field: 'name' | 'description', value: string) => {
    setTranslations(prev => prev.map(t => t.language === lang ? { ...t, [field]: value } : t));
  };

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

  const handleSubmit = async (values: any) => {
    try {
      console.log('Form values:', values);
      console.log('Translations:', translations);
      
      // Validate required fields
      if (!values.categoryId) {
        console.error('CategoryId is missing!');
        alert('Vui lòng chọn danh mục');
        return;
      }
      
      const translationsToSend = translations.map(t => ({
        language: t.language,
        name: t.name.trim(),
        description: t.description?.trim() || '',
      }));
      const viTranslation = translations.find(t => t.language === 'vi') || translations[0];
      const name = viTranslation?.name?.trim() || '';
      const description = viTranslation?.description?.trim() || '';
      
      console.log('viTranslation:', viTranslation);
      console.log('name before slugify:', name);
      
      const slug = slugify(name) || 'service-' + Date.now();
      
      console.log('slug after slugify:', slug);
      
      // Ensure all values are properly formatted
      const payload = {
        name,
        slug,
        description,
        duration: Number(values.duration) || 1,
        price: 1, // Default value since backend requires it
        coverImage: values.coverImage || '',
        categoryId: values.categoryId,
        translations: translationsToSend,
      };
      
      console.log('values.categoryId:', values.categoryId);
      console.log('Service payload being sent:', payload);
      
      if (service && service.id) {
        await serviceService.update(service.id, payload);
      } else {
        await serviceService.create(payload);
      }
      onClose(true);
    } catch (error) {
      console.error('Error creating/updating service:', error);
      // handle error
    }
  };

  return (
    <Modal opened={opened} onClose={() => onClose()} title={service ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}>
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
                  label={`Tên dịch vụ (${LANGS.find(l => l.value === t.language)?.label || t.language})`}
                  value={t.name}
                  onChange={e => handleTranslationChange(t.language, 'name', e.target.value)}
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
          
          {/* Categories và ImageUpload luôn hiển thị */}
          <Select
            label="Danh mục"
            required
            mt="md"
            data={categories}
            placeholder="Chọn danh mục"
            {...form.getInputProps('categoryId')}
            style={isMobile ? { width: '100%' } : {}}
          />
          <ImageUpload 
            onChange={handleImageChange} 
            uploading={uploading}
            initialImage={service?.coverImage}
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