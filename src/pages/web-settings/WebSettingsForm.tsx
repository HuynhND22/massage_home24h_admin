import { useEffect, useState } from 'react';
import { TextInput, Button, Group, Stack, Box, Textarea, Image, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IWebSettings } from '../../interfaces/webSettings.interface';
import { webSettingsService } from '../../services/webSettings.service';
import { notifications } from '@mantine/notifications';
import { ImageUpload } from '../../components/ImageUpload';
import { useMediaQuery } from '@mantine/hooks';

export function WebSettingsForm() {
  const [loading, setLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [webSettingsId, setWebSettingsId] = useState<string | undefined>(undefined);
  const isMobile = useMediaQuery('(max-width: 600px)');

  const form = useForm<IWebSettings & { logoFile?: File }>({
    initialValues: {
      siteName: '',
      address: '',
      logo: '',
      workingHours: '',
      googleMap: '',
      email: '',
      phone: '',
      facebook: '',
      zalo: '',
      kakaotalk: '',
      telegram: '',
      wechat: '',
      line: '',
      logoFile: undefined,
    },
  });

  useEffect(() => {
    // Lấy settings đầu tiên (nếu có)
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await webSettingsService.getAll();
        // Ưu tiên lấy items[0], nếu không có thì lấy trực tiếp object
        const s = data.items?.[0] || data;
        if (s && s.siteName) {
          setWebSettingsId(s.id);
          form.setValues({
            siteName: s.siteName || '',
            address: s.address || '',
            logo: s.logo || '',
            workingHours: s.workingHours || '',
            googleMap: s.googleMap || '',
            email: s.email || '',
            phone: s.phone || '',
            facebook: s.facebook || '',
            zalo: s.zalo || '',
            kakaotalk: s.kakaotalk || '',
            telegram: s.telegram || '',
            wechat: s.wechat || '',
            line: s.line || '',
            logoFile: undefined,
          });
        }
      } catch (e) {
        // ignore
      }
      setLoading(false);
    };
    fetchSettings();
    // eslint-disable-next-line
  }, []);

  const handleLogoChange = (file: File | null) => {
    form.setFieldValue('logoFile', file || undefined);
    if (file) {
      const url = URL.createObjectURL(file);
      form.setFieldValue('logo', url);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      if (webSettingsId) {
        await webSettingsService.update(webSettingsId, values);
        notifications.show({ title: 'Thành công', message: 'Đã cập nhật thông tin website', color: 'green' });
      } else {
        await webSettingsService.create(values);
        notifications.show({ title: 'Thành công', message: 'Đã tạo thông tin website', color: 'green' });
      }
    } catch (e) {
      notifications.show({ title: 'Lỗi', message: 'Không thể lưu thông tin', color: 'red' });
    }
    setLoading(false);
  };

  return (
    <Paper p={isMobile ? 'xs' : 'md'} shadow="xs" maw={600} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput label="Tên website" required {...form.getInputProps('siteName')} style={isMobile ? { width: '100%' } : {}} />
          <TextInput label="Địa chỉ" {...form.getInputProps('address')} style={isMobile ? { width: '100%' } : {}} />
          <ImageUpload onChange={handleLogoChange} uploading={logoUploading} initialImage={form.values.logo} />
          <TextInput label="Giờ làm việc" {...form.getInputProps('workingHours')} style={isMobile ? { width: '100%' } : {}} />
          <Textarea label="Google Map (iframe)" {...form.getInputProps('googleMap')} style={isMobile ? { width: '100%' } : {}} />
          <TextInput label="Email" {...form.getInputProps('email')} style={isMobile ? { width: '100%' } : {}} />
          <TextInput label="Số điện thoại" {...form.getInputProps('phone')} style={isMobile ? { width: '100%' } : {}} />
          <TextInput label="Facebook" {...form.getInputProps('facebook')} style={isMobile ? { width: '100%' } : {}} />
          <TextInput label="Zalo" {...form.getInputProps('zalo')} style={isMobile ? { width: '100%' } : {}} />
          <TextInput label="KakaoTalk" {...form.getInputProps('kakaotalk')} style={isMobile ? { width: '100%' } : {}} />
          <TextInput label="Telegram" {...form.getInputProps('telegram')} style={isMobile ? { width: '100%' } : {}} />
          <TextInput label="WeChat" {...form.getInputProps('wechat')} style={isMobile ? { width: '100%' } : {}} />
          <TextInput label="Line" {...form.getInputProps('line')} style={isMobile ? { width: '100%' } : {}} />
          <Group justify="flex-end" style={isMobile ? { flexDirection: 'column', gap: 8 } : {}}>
            <Button type="submit" loading={loading} fullWidth={isMobile}>Lưu</Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
} 