import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Button,
  Group,
  Card,
  LoadingOverlay,
  Tabs,
  Grid,
  Stack,
  Image,
  FileInput,
  Paper,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconDeviceFloppy, IconUpload } from '@tabler/icons-react';

// Định nghĩa kiểu dữ liệu cho bản dịch
interface Translation {
  language: string;
  name: string;
  description: string;
}

// Định nghĩa kiểu dữ liệu cho form dịch vụ
export interface ServiceFormValues {
  name: string;
  description: string;
  slug: string;
  price: number;
  duration: number;
  isActive: boolean;
  image: File | null;
  translations: {
    vi: Translation;
    zh: Translation;
    ko: Translation;
    ru: Translation;
  };
  currentImageUrl?: string;
}

interface ServiceFormProps {
  initialValues?: Partial<ServiceFormValues>;
  loading: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
}

export default function ServiceForm({ initialValues, loading, onSubmit, onCancel }: ServiceFormProps) {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Tạo form với giá trị mặc định
  const form = useForm<ServiceFormValues>({
    initialValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      slug: initialValues?.slug || '',
      price: initialValues?.price || 0,
      duration: initialValues?.duration || 60,
      isActive: initialValues?.isActive !== undefined ? initialValues.isActive : true,
      image: null,
      translations: {
        vi: initialValues?.translations?.vi || { language: 'vi', name: '', description: '' },
        zh: initialValues?.translations?.zh || { language: 'zh', name: '', description: '' },
        ko: initialValues?.translations?.ko || { language: 'ko', name: '', description: '' },
        ru: initialValues?.translations?.ru || { language: 'ru', name: '', description: '' },
      },
      currentImageUrl: initialValues?.currentImageUrl || '',
    },
    validate: {
      name: (value) => (!value ? 'Tên dịch vụ là bắt buộc' : null),
      slug: (value) => (!value ? 'Slug là bắt buộc' : null),
      description: (value) => (!value ? 'Mô tả dịch vụ là bắt buộc' : null),
      price: (value) => (value < 0 ? 'Giá không được âm' : null),
      duration: (value) => (value <= 0 ? 'Thời lượng phải lớn hơn 0' : null),
    },
  });

  // Cập nhật image preview khi có ảnh ban đầu
  useEffect(() => {
    if (initialValues?.currentImageUrl) {
      setImagePreview(initialValues.currentImageUrl);
    }
  }, [initialValues?.currentImageUrl]);

  // Xử lý khi chọn file ảnh
  const handleImageChange = (file: File | null) => {
    form.setFieldValue('image', file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý khi submit form
  const handleSubmit = async (values: ServiceFormValues) => {
    // Tạo FormData để gửi dữ liệu
    const formData = new FormData();
    
    // Thêm các trường cơ bản
    formData.append('name', values.name);
    formData.append('slug', values.slug);
    formData.append('description', values.description);
    formData.append('price', values.price.toString());
    formData.append('duration', values.duration.toString());
    formData.append('isActive', values.isActive.toString());
    
    // Chuyển đổi translations thành chuỗi JSON
    const translationsArray = Object.values(values.translations)
      .filter(trans => trans.name.trim() !== '' || trans.description.trim() !== '');
    
    // Sử dụng key đơn giản cho translations
    formData.append('translations', JSON.stringify(translationsArray));
    
    // Thêm hình ảnh nếu có
    if (values.image) {
      formData.append('image', values.image);
    }
    
    await onSubmit(formData);
  };

  // Xử lý quay lại
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/services');
    }
  };

  return (
    <>
      <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
      
      <Group mb="md" justify="space-between">
        <Button 
          leftSection={<IconArrowLeft size={16} />}
          variant="default"
          onClick={handleCancel}
        >
          Quay lại
        </Button>
        
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={() => form.onSubmit(handleSubmit)()}
        >
          Lưu dịch vụ
        </Button>
      </Group>
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Card shadow="sm" p="lg" radius="md" mb="xl">
          <Tabs defaultValue="general">
            <Tabs.List mb="md">
              <Tabs.Tab value="general">Thông tin chung</Tabs.Tab>
              <Tabs.Tab value="translations">Bản dịch</Tabs.Tab>
            </Tabs.List>
            
            <Tabs.Panel value="general">
              <Grid>
                <Grid.Col span={8}>
                  <Stack gap="md">
                    <TextInput
                      label="Tên dịch vụ"
                      placeholder="Nhập tên dịch vụ"
                      required
                      {...form.getInputProps('name')}
                    />
                    
                    <TextInput
                      label="Slug (URL)"
                      placeholder="nhap-ten-dich-vu"
                      required
                      {...form.getInputProps('slug')}
                    />
                    
                    <Textarea
                      label="Mô tả"
                      placeholder="Nhập mô tả dịch vụ"
                      required
                      minRows={4}
                      {...form.getInputProps('description')}
                    />
                    
                    <Grid>
                      <Grid.Col span={6}>
                        <NumberInput
                          label="Giá (USD)"
                          placeholder="0"
                          min={0}
                          decimalScale={2}
                          required
                          {...form.getInputProps('price')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <NumberInput
                          label="Thời gian (phút)"
                          placeholder="60"
                          min={1}
                          required
                          {...form.getInputProps('duration')}
                        />
                      </Grid.Col>
                    </Grid>
                    
                    <Switch
                      label="Đang hoạt động"
                      description="Dịch vụ có hiển thị trên trang chủ hay không"
                      {...form.getInputProps('isActive', { type: 'checkbox' })}
                    />
                  </Stack>
                </Grid.Col>
                
                <Grid.Col span={4}>
                  <Paper shadow="sm" p="md" radius="md" withBorder>
                    <Stack>
                      <Text size="sm" fw={500}>Hình ảnh dịch vụ</Text>
                      
                      {imagePreview && (
                        <Image
                          radius="md"
                          src={imagePreview}
                          alt="Hình ảnh dịch vụ"
                          fallbackSrc="https://placehold.co/400x300?text=No+Image"
                        />
                      )}
                      
                      <FileInput
                        label="Tải lên hình ảnh"
                        placeholder="Chọn file"
                        accept="image/*"
                        leftSection={<IconUpload size={16} />}
                        value={form.values.image}
                        onChange={handleImageChange}
                      />
                    </Stack>
                  </Paper>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
            
            <Tabs.Panel value="translations">
              <Tabs defaultValue="vi">
                <Tabs.List mb="md">
                  <Tabs.Tab value="vi">Tiếng Việt</Tabs.Tab>
                  <Tabs.Tab value="zh">Tiếng Trung</Tabs.Tab>
                  <Tabs.Tab value="ko">Tiếng Hàn</Tabs.Tab>
                  <Tabs.Tab value="ru">Tiếng Nga</Tabs.Tab>
                </Tabs.List>
                
                <Tabs.Panel value="vi">
                  <Stack gap="md">
                    <TextInput
                      label="Tên dịch vụ (Tiếng Việt)"
                      placeholder="Nhập tên dịch vụ bằng tiếng Việt"
                      {...form.getInputProps('translations.vi.name')}
                    />
                    <Textarea
                      label="Mô tả (Tiếng Việt)"
                      placeholder="Nhập mô tả dịch vụ bằng tiếng Việt"
                      minRows={4}
                      {...form.getInputProps('translations.vi.description')}
                    />
                  </Stack>
                </Tabs.Panel>
                
                <Tabs.Panel value="zh">
                  <Stack gap="md">
                    <TextInput
                      label="Tên dịch vụ (Tiếng Trung)"
                      placeholder="Nhập tên dịch vụ bằng tiếng Trung"
                      {...form.getInputProps('translations.zh.name')}
                    />
                    <Textarea
                      label="Mô tả (Tiếng Trung)"
                      placeholder="Nhập mô tả dịch vụ bằng tiếng Trung"
                      minRows={4}
                      {...form.getInputProps('translations.zh.description')}
                    />
                  </Stack>
                </Tabs.Panel>
                
                <Tabs.Panel value="ko">
                  <Stack gap="md">
                    <TextInput
                      label="Tên dịch vụ (Tiếng Hàn)"
                      placeholder="Nhập tên dịch vụ bằng tiếng Hàn"
                      {...form.getInputProps('translations.ko.name')}
                    />
                    <Textarea
                      label="Mô tả (Tiếng Hàn)"
                      placeholder="Nhập mô tả dịch vụ bằng tiếng Hàn"
                      minRows={4}
                      {...form.getInputProps('translations.ko.description')}
                    />
                  </Stack>
                </Tabs.Panel>
                
                <Tabs.Panel value="ru">
                  <Stack gap="md">
                    <TextInput
                      label="Tên dịch vụ (Tiếng Nga)"
                      placeholder="Nhập tên dịch vụ bằng tiếng Nga"
                      {...form.getInputProps('translations.ru.name')}
                    />
                    <Textarea
                      label="Mô tả (Tiếng Nga)"
                      placeholder="Nhập mô tả dịch vụ bằng tiếng Nga"
                      minRows={4}
                      {...form.getInputProps('translations.ru.description')}
                    />
                  </Stack>
                </Tabs.Panel>
              </Tabs>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </form>
    </>
  );
}
