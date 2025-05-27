import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Title,
  Card,
  Group,
  Button,
  TextInput,
  Textarea,
  LoadingOverlay,
  Tabs,
  Divider,
  Grid,
  Paper,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { settingsService } from '../../services/settings.service';

interface SettingItem {
  id: number;
  key: string;
  value: string;
  translations: {
    id: number;
    language: string;
    value: string;
    settingId: number;
  }[];
}

interface SettingsFormValues {
  contact_phone: string;
  contact_email: string;
  contact_address: {
    default: string;
    vi: string;
    zh: string;
    ko: string;
    ru: string;
  };
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  working_hours: {
    default: string;
    vi: string;
    zh: string;
    ko: string;
    ru: string;
  };
  about_us: {
    default: string;
    vi: string;
    zh: string;
    ko: string;
    ru: string;
  };
}

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SettingItem[]>([]);

  // Form với giá trị mặc định
  const form = useForm<SettingsFormValues>({
    initialValues: {
      contact_phone: '',
      contact_email: '',
      contact_address: {
        default: '',
        vi: '',
        zh: '',
        ko: '',
        ru: '',
      },
      social_facebook: '',
      social_instagram: '',
      social_twitter: '',
      working_hours: {
        default: '',
        vi: '',
        zh: '',
        ko: '',
        ru: '',
      },
      about_us: {
        default: '',
        vi: '',
        zh: '',
        ko: '',
        ru: '',
      },
    },
  });

  // Tải cài đặt từ API
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await settingsService.getAllSettings();
      const settingsData = response.data.data;
      setSettings(settingsData);
      
      // Cập nhật giá trị form từ dữ liệu API
      const formValues: any = { ...form.values };
      
      settingsData.forEach((setting: SettingItem) => {
        // Cài đặt không có bản dịch
        if (['contact_phone', 'contact_email', 'social_facebook', 'social_instagram', 'social_twitter'].includes(setting.key)) {
          formValues[setting.key] = setting.value;
        } 
        // Cài đặt có bản dịch
        else if (['contact_address', 'working_hours', 'about_us'].includes(setting.key)) {
          formValues[setting.key] = {
            default: setting.value,
          };
          
          // Thêm các bản dịch
          setting.translations.forEach((translation) => {
            formValues[setting.key][translation.language] = translation.value;
          });
        }
      });
      
      form.setValues(formValues);
    } catch (error) {
      console.error('Error fetching settings:', error);
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể tải cài đặt website',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [form, setLoading, setSettings]);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Lưu cài đặt
  const handleSubmit = async (values: SettingsFormValues) => {
    try {
      setLoading(true);
      
      // Danh sách cài đặt cần cập nhật
      const settingsToUpdate = [
        {
          key: 'contact_phone',
          value: values.contact_phone,
          translations: [],
        },
        {
          key: 'contact_email',
          value: values.contact_email,
          translations: [],
        },
        {
          key: 'social_facebook',
          value: values.social_facebook,
          translations: [],
        },
        {
          key: 'social_instagram',
          value: values.social_instagram,
          translations: [],
        },
        {
          key: 'social_twitter',
          value: values.social_twitter,
          translations: [],
        },
        {
          key: 'contact_address',
          value: values.contact_address.default,
          translations: [
            { language: 'vi', value: values.contact_address.vi },
            { language: 'zh', value: values.contact_address.zh },
            { language: 'ko', value: values.contact_address.ko },
            { language: 'ru', value: values.contact_address.ru },
          ],
        },
        {
          key: 'working_hours',
          value: values.working_hours.default,
          translations: [
            { language: 'vi', value: values.working_hours.vi },
            { language: 'zh', value: values.working_hours.zh },
            { language: 'ko', value: values.working_hours.ko },
            { language: 'ru', value: values.working_hours.ru },
          ],
        },
        {
          key: 'about_us',
          value: values.about_us.default,
          translations: [
            { language: 'vi', value: values.about_us.vi },
            { language: 'zh', value: values.about_us.zh },
            { language: 'ko', value: values.about_us.ko },
            { language: 'ru', value: values.about_us.ru },
          ],
        },
      ];
      
      // Cập nhật từng cài đặt
      for (const setting of settingsToUpdate) {
        // Kiểm tra xem cài đặt đã tồn tại chưa
        const existingSetting = settings.find(s => s.key === setting.key);
        
        if (existingSetting) {
          // Cập nhật cài đặt hiện có
          await settingsService.updateSetting(setting.key, setting);
        } else {
          // Tạo cài đặt mới
          await settingsService.createSetting(setting);
        }
      }
      
      notifications.show({
        title: 'Thành công',
        message: 'Đã cập nhật cài đặt website',
        color: 'teal',
      });
      
      // Tải lại dữ liệu
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể lưu cài đặt website',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      <LoadingOverlay visible={loading} />
      
      <Group justify="space-between" mb="md">
        <Title order={2}>Cài đặt website</Title>
        <Button 
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={() => form.onSubmit(handleSubmit)()}
          variant="gradient" 
          gradient={{ from: 'teal', to: 'blue', deg: 60 }}
        >
          Lưu cài đặt
        </Button>
      </Group>
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Card shadow="sm" p="lg" radius="md" mb="xl">
          <Tabs defaultValue="general">
            <Tabs.List mb="md">
              <Tabs.Tab value="general">Thông tin chung</Tabs.Tab>
              <Tabs.Tab value="contact">Thông tin liên hệ</Tabs.Tab>
              <Tabs.Tab value="social">Mạng xã hội</Tabs.Tab>
              <Tabs.Tab value="about">Giới thiệu</Tabs.Tab>
            </Tabs.List>
            
            <Tabs.Panel value="general">
              <Paper p="md" withBorder mb="xl">
                <Title order={4} mb="md">Thời gian làm việc</Title>
                
                <Grid>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Mặc định (Tiếng Anh)"
                      placeholder="Thứ Hai - Thứ Bảy: 9:00 AM - 8:00 PM, Chủ Nhật: 10:00 AM - 6:00 PM"
                      {...form.getInputProps('working_hours.default')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <TextInput
                      label="Tiếng Việt"
                      placeholder="Thứ Hai - Thứ Bảy: 9:00 - 20:00, Chủ Nhật: 10:00 - 18:00"
                      {...form.getInputProps('working_hours.vi')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <TextInput
                      label="Tiếng Trung"
                      placeholder="周一至周六：上午9:00 - 晚上8:00，周日：上午10:00 - 晚上6:00"
                      {...form.getInputProps('working_hours.zh')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <TextInput
                      label="Tiếng Hàn"
                      placeholder="월요일 - 토요일: 오전 9:00 - 오후 8:00, 일요일: 오전 10:00 - 오후 6:00"
                      {...form.getInputProps('working_hours.ko')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <TextInput
                      label="Tiếng Nga"
                      placeholder="Понедельник - Суббота: 9:00 - 20:00, Воскресенье: 10:00 - 18:00"
                      {...form.getInputProps('working_hours.ru')}
                    />
                  </Grid.Col>
                </Grid>
              </Paper>
            </Tabs.Panel>
            
            <Tabs.Panel value="contact">
              <Paper p="md" withBorder mb="xl">
                <Title order={4} mb="md">Thông tin liên hệ</Title>
                
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Số điện thoại"
                      placeholder="+84 123 456 789"
                      {...form.getInputProps('contact_phone')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <TextInput
                      label="Email"
                      placeholder="info@sparenew.com"
                      {...form.getInputProps('contact_email')}
                    />
                  </Grid.Col>
                </Grid>
              </Paper>
              
              <Paper p="md" withBorder>
                <Title order={4} mb="md">Địa chỉ</Title>
                
                <Grid>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Mặc định (Tiếng Anh)"
                      placeholder="123 Spa Street, District 1, Ho Chi Minh City, Vietnam"
                      {...form.getInputProps('contact_address.default')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <TextInput
                      label="Tiếng Việt"
                      placeholder="123 Đường Spa, Quận 1, Thành phố Hồ Chí Minh, Việt Nam"
                      {...form.getInputProps('contact_address.vi')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <TextInput
                      label="Tiếng Trung"
                      placeholder="越南胡志明市第一郡SPA街123号"
                      {...form.getInputProps('contact_address.zh')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <TextInput
                      label="Tiếng Hàn"
                      placeholder="베트남 호치민시 1군 스파 거리 123번지"
                      {...form.getInputProps('contact_address.ko')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={6}>
                    <TextInput
                      label="Tiếng Nga"
                      placeholder="123 улица Спа, Район 1, Хошимин, Вьетнам"
                      {...form.getInputProps('contact_address.ru')}
                    />
                  </Grid.Col>
                </Grid>
              </Paper>
            </Tabs.Panel>
            
            <Tabs.Panel value="social">
              <Paper p="md" withBorder>
                <Title order={4} mb="md">Liên kết mạng xã hội</Title>
                
                <Grid>
                  <Grid.Col span={12}>
                    <TextInput
                      label="Facebook"
                      placeholder="https://facebook.com/sparenew"
                      {...form.getInputProps('social_facebook')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <TextInput
                      label="Instagram"
                      placeholder="https://instagram.com/sparenew"
                      {...form.getInputProps('social_instagram')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <TextInput
                      label="Twitter"
                      placeholder="https://twitter.com/sparenew"
                      {...form.getInputProps('social_twitter')}
                    />
                  </Grid.Col>
                </Grid>
              </Paper>
            </Tabs.Panel>
            
            <Tabs.Panel value="about">
              <Paper p="md" withBorder>
                <Title order={4} mb="md">Giới thiệu</Title>
                
                <Grid>
                  <Grid.Col span={12}>
                    <Textarea
                      label="Mặc định (Tiếng Anh)"
                      placeholder="About our spa..."
                      minRows={4}
                      {...form.getInputProps('about_us.default')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <Textarea
                      label="Tiếng Việt"
                      placeholder="Về spa của chúng tôi..."
                      minRows={4}
                      {...form.getInputProps('about_us.vi')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <Textarea
                      label="Tiếng Trung"
                      placeholder="关于我们的水疗中心..."
                      minRows={4}
                      {...form.getInputProps('about_us.zh')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <Textarea
                      label="Tiếng Hàn"
                      placeholder="스파 소개..."
                      minRows={4}
                      {...form.getInputProps('about_us.ko')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <Textarea
                      label="Tiếng Nga"
                      placeholder="О нашем спа-салоне..."
                      minRows={4}
                      {...form.getInputProps('about_us.ru')}
                    />
                  </Grid.Col>
                </Grid>
              </Paper>
            </Tabs.Panel>
          </Tabs>
          
          <Divider my="xl" />
          
          <Group justify="flex-end">
            <Button 
              type="submit" 
              leftSection={<IconDeviceFloppy size={16} />}
              variant="gradient" 
              gradient={{ from: 'teal', to: 'blue', deg: 60 }}
            >
              Lưu cài đặt
            </Button>
          </Group>
        </Card>
      </form>
    </Container>
  );
}
