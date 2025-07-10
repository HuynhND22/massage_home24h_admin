import { useEffect, useState } from 'react';
import { TextInput, Button, Group, Stack, Textarea, Paper, Grid, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IWebSettings } from '../../interfaces/webSettings.interface';
import { webSettingsService } from '../../services/webSettings.service';
import { notifications } from '@mantine/notifications';
import { ImageUpload } from '../../components/ImageUpload';
import { useMediaQuery } from '@mantine/hooks';
import { uploadService } from '../../services/upload.service';

interface QrUploadProps {
  label: string;
  value?: string;
  onChange: (file: File | null) => void;
  uploading: boolean;
}

const QrCodeUpload = ({ label, value, onChange, uploading }: QrUploadProps) => {
  return (
    <div>
      <ImageUpload 
        onChange={onChange}
        uploading={uploading}
        initialImage={value}
        label={`QR Code cho ${label}`}
      />
    </div>
  );
};

export function WebSettingsForm() {
  const [loading, setLoading] = useState(false);
  const [logoUploading] = useState(false);
  const [webSettingsId, setWebSettingsId] = useState<string | undefined>(undefined);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [uploadingQr, setUploadingQr] = useState<{ [key: string]: boolean }>({});
  // Thêm state để lưu trữ thông tin ảnh cần xóa
  const [pendingDeleteImages, setPendingDeleteImages] = useState<{[key: string]: string}>({});

  const form = useForm<IWebSettings>({
    initialValues: {
      siteName: '',
      address: undefined,
      logo: undefined,
      workingHours: undefined,
      googleMap: undefined,
      email: undefined,
      phone: undefined,
      messenger: undefined,
      messengerQr: undefined,
      zalo: undefined,
      zaloQr: undefined,
      kakaotalk: undefined,
      kakaotalkQr: undefined,
      telegram: undefined,
      telegramQr: undefined,
      wechat: undefined,
      wechatQr: undefined,
      line: undefined,
      lineQr: undefined,
      whatsapp: undefined,
      whatsappQr: undefined,
      instagram: undefined,
      instagramQr: undefined,
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const settings = await webSettingsService.getAll();
        if (settings) {
          setWebSettingsId(settings.id);
          form.setValues({
            siteName: settings.siteName || '',
            address: settings.address || undefined,
            logo: settings.logo || undefined,
            workingHours: settings.workingHours || undefined,
            googleMap: settings.googleMap || undefined,
            email: settings.email || undefined,
            phone: settings.phone || undefined,
            messenger: settings.messenger || undefined,
            messengerQr: settings.messengerQr || undefined,
            zalo: settings.zalo || undefined,
            zaloQr: settings.zaloQr || undefined,
            kakaotalk: settings.kakaotalk || undefined,
            kakaotalkQr: settings.kakaotalkQr || undefined,
            telegram: settings.telegram || undefined,
            telegramQr: settings.telegramQr || undefined,
            wechat: settings.wechat || undefined,
            wechatQr: settings.wechatQr || undefined,
            line: settings.line || undefined,
            lineQr: settings.lineQr || undefined,
            whatsapp: settings.whatsapp || undefined,
            whatsappQr: settings.whatsappQr || undefined,
            instagram: settings.instagram || undefined,
            instagramQr: settings.instagramQr || undefined,
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        notifications.show({
          title: 'Lỗi',
          message: 'Không thể tải thông tin cài đặt',
          color: 'red'
        });
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleLogoChange = async (file: File | null) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const { url } = await uploadService.uploadImage(formData);
        form.setFieldValue('logo', url);
      } catch (error) {
        notifications.show({
          title: 'Lỗi',
          message: 'Không thể upload logo',
          color: 'red'
        });
      }
    } else {
      form.setFieldValue('logo', undefined);
    }
  };

  const handleQrChange = (field: keyof IWebSettings) => async (file: File | null) => {
    if (file) {
      try {
        setUploadingQr(prev => ({ ...prev, [field]: true }));
        const formData = new FormData();
        formData.append('file', file);
        const { url } = await uploadService.uploadImage(formData);
        form.setFieldValue(field, url);
        // Nếu trước đó field này đã được đánh dấu xóa, thì bỏ đánh dấu
        if (pendingDeleteImages[field]) {
          setPendingDeleteImages(prev => {
            const newState = { ...prev };
            delete newState[field];
            return newState;
          });
        }
      } catch (error) {
        notifications.show({ 
          title: 'Lỗi', 
          message: 'Không thể upload ảnh QR code', 
          color: 'red' 
        });
      } finally {
        setUploadingQr(prev => ({ ...prev, [field]: false }));
      }
    } else {
      // Khi nhấn nút xóa, lưu lại URL cũ và đánh dấu trường là rỗng
      const oldImageUrl = form.values[field];
      if (oldImageUrl) {
        setPendingDeleteImages(prev => ({
          ...prev,
          [field]: oldImageUrl
        }));
        // Set trường thành undefined để khi update sẽ xóa khỏi DB
        form.setFieldValue(field, undefined);
      }
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      // Tạo payload với các trường QR được đánh dấu rõ là chuỗi rỗng khi bị xóa
      const dataToSubmit: Partial<IWebSettings> = {
        ...values,
        // Các trường thông tin cơ bản
        siteName: values.siteName,
        address: values.address || undefined,
        logo: values.logo || undefined,
        workingHours: values.workingHours || undefined,
        googleMap: values.googleMap || undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
        // Các trường liên kết mạng xã hội
        messenger: values.messenger || undefined,
        zalo: values.zalo || undefined,
        kakaotalk: values.kakaotalk || undefined,
        telegram: values.telegram || undefined,
        wechat: values.wechat || undefined,
        line: values.line || undefined,
        whatsapp: values.whatsapp || undefined,
        instagram: values.instagram || undefined,
        // Các trường QR code - gửi chuỗi rỗng nếu bị xóa
        messengerQr: values.messengerQr === undefined ? '' : values.messengerQr,
        zaloQr: values.zaloQr === undefined ? '' : values.zaloQr,
        kakaotalkQr: values.kakaotalkQr === undefined ? '' : values.kakaotalkQr,
        telegramQr: values.telegramQr === undefined ? '' : values.telegramQr,
        wechatQr: values.wechatQr === undefined ? '' : values.wechatQr,
        lineQr: values.lineQr === undefined ? '' : values.lineQr,
        whatsappQr: values.whatsappQr === undefined ? '' : values.whatsappQr,
        instagramQr: values.instagramQr === undefined ? '' : values.instagramQr,
      };

      // Gọi API update/create
      let updatedSettings;
      if (webSettingsId) {
        updatedSettings = await webSettingsService.update(webSettingsId, dataToSubmit);
      } else {
        updatedSettings = await webSettingsService.create(dataToSubmit);
      }

      // Sau khi update thành công, kiểm tra từng trường đã đánh dấu xóa
      const deletePromises = Object.entries(pendingDeleteImages).map(async ([field, oldImageUrl]) => {
        // Kiểm tra xem trường trong response có giá trị không
        const newImageUrl = updatedSettings[field];
        if (!newImageUrl) {
          try {
            await uploadService.deleteFile(oldImageUrl);
            console.log(`Đã xóa ảnh ${field} khỏi bucket:`, oldImageUrl);
          } catch (error) {
            console.error(`Lỗi khi xóa ảnh ${field} khỏi bucket:`, error);
            notifications.show({
              title: 'Cảnh báo',
              message: 'Đã cập nhật thông tin nhưng không thể xóa một số ảnh khỏi bucket',
              color: 'yellow'
            });
          }
        }
      });

      await Promise.all(deletePromises);
      // Reset danh sách ảnh cần xóa
      setPendingDeleteImages({});
      
      notifications.show({ 
        title: 'Thành công', 
        message: webSettingsId ? 'Đã cập nhật thông tin website' : 'Đã tạo thông tin website', 
        color: 'green' 
      });
    } catch (e) {
      notifications.show({ title: 'Lỗi', message: 'Không thể lưu thông tin', color: 'red' });
    }
    setLoading(false);
  };

  return (
    <Paper p={isMobile ? 'xs' : 'md'} shadow="xs" maw={800} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput label="Tên website" required {...form.getInputProps('siteName')} style={isMobile ? { width: '100%' } : {}} />
          <TextInput label="Địa chỉ" {...form.getInputProps('address')} style={isMobile ? { width: '100%' } : {}} />
          <ImageUpload onChange={handleLogoChange} uploading={logoUploading} initialImage={form.values.logo} label="Logo" />
          <TextInput label="Giờ làm việc" {...form.getInputProps('workingHours')} style={isMobile ? { width: '100%' } : {}} />
          <Textarea label="Google Map (iframe)" {...form.getInputProps('googleMap')} style={isMobile ? { width: '100%' } : {}} />
          <TextInput label="Email" {...form.getInputProps('email')} style={isMobile ? { width: '100%' } : {}} />
          <TextInput label="Số điện thoại" {...form.getInputProps('phone')} style={isMobile ? { width: '100%' } : {}} />
          
          <Text size="lg" fw={500} mt="md">Mạng xã hội & QR Code</Text>

          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput label="Messenger" {...form.getInputProps('messenger')} />
              <QrCodeUpload
                label="Messenger"
                value={form.values.messengerQr}
                onChange={handleQrChange('messengerQr')}
                uploading={uploadingQr['messengerQr'] || false}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput label="Zalo" {...form.getInputProps('zalo')} />
              <QrCodeUpload
                label="Zalo"
                value={form.values.zaloQr}
                onChange={handleQrChange('zaloQr')}
                uploading={uploadingQr['zaloQr'] || false}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput label="KakaoTalk" {...form.getInputProps('kakaotalk')} />
              <QrCodeUpload
                label="KakaoTalk"
                value={form.values.kakaotalkQr}
                onChange={handleQrChange('kakaotalkQr')}
                uploading={uploadingQr['kakaotalkQr'] || false}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput label="Telegram" {...form.getInputProps('telegram')} />
              <QrCodeUpload
                label="Telegram"
                value={form.values.telegramQr}
                onChange={handleQrChange('telegramQr')}
                uploading={uploadingQr['telegramQr'] || false}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput label="WeChat" {...form.getInputProps('wechat')} />
              <QrCodeUpload
                label="WeChat"
                value={form.values.wechatQr}
                onChange={handleQrChange('wechatQr')}
                uploading={uploadingQr['wechatQr'] || false}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput label="Line" {...form.getInputProps('line')} />
              <QrCodeUpload
                label="Line"
                value={form.values.lineQr}
                onChange={handleQrChange('lineQr')}
                uploading={uploadingQr['lineQr'] || false}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput label="WhatsApp" {...form.getInputProps('whatsapp')} />
              <QrCodeUpload
                label="WhatsApp"
                value={form.values.whatsappQr}
                onChange={handleQrChange('whatsappQr')}
                uploading={uploadingQr['whatsappQr'] || false}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput label="Instagram" {...form.getInputProps('instagram')} />
              <QrCodeUpload
                label="Instagram"
                value={form.values.instagramQr}
                onChange={handleQrChange('instagramQr')}
                uploading={uploadingQr['instagramQr'] || false}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" style={isMobile ? { flexDirection: 'column', gap: 8 } : {}}>
            <Button type="submit" loading={loading} fullWidth={isMobile}>Lưu</Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
} 