import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput,
  Textarea,
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
  Select,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconDeviceFloppy, IconUpload } from '@tabler/icons-react';
import { blogService } from '../../services/blog.service';

// Định nghĩa kiểu dữ liệu cho bản dịch
interface Translation {
  language: string;
  title: string;
  content: string;
}

// Định nghĩa kiểu dữ liệu cho form bài viết
export interface PostFormValues {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  isPublished: boolean;
  publishDate: Date | null;
  category: string;
  author: string;
  tags: string;
  image: File | null;
  currentImageUrl: string | null;
  translations: {
    vi: Translation;
    en: Translation;
    zh: Translation;
    ko: Translation;
  };
}

interface PostFormProps {
  initialValues?: Partial<PostFormValues>;
  loading: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel?: () => void;
}

export default function PostForm({ initialValues, loading, onSubmit, onCancel }: PostFormProps) {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);

  // Tải danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await blogService.getCategories();
        const categoriesData = response.data.data.map((category: any) => ({
          value: category.id.toString(),
          label: category.name,
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Tạo đối tượng translations mặc định
  const defaultTranslations = {
    vi: { language: 'vi', title: '', content: '' },
    en: { language: 'en', title: '', content: '' },
    zh: { language: 'zh', title: '', content: '' },
    ko: { language: 'ko', title: '', content: '' },
  };

  // Tạo form với giá trị mặc định
  const form = useForm<PostFormValues>({
    initialValues: {
      title: initialValues?.title || '',
      slug: initialValues?.slug || '',
      content: initialValues?.content || '',
      excerpt: initialValues?.excerpt || '',
      isPublished: initialValues?.isPublished !== undefined ? initialValues.isPublished : true,
      publishDate: initialValues?.publishDate || new Date(),
      category: initialValues?.category || '',
      author: initialValues?.author || '',
      tags: initialValues?.tags || '',
      image: null,
      currentImageUrl: initialValues?.currentImageUrl || null,
      translations: initialValues?.translations || defaultTranslations,
    },
    validate: {
      title: (value: string) => (value.trim().length > 0 ? null : 'Vui lòng nhập tiêu đề bài viết'),
      slug: (value: string) => (value.trim().length > 0 ? null : 'Slug không được để trống'),
      excerpt: (value: string) => (value.trim().length > 0 ? null : 'Vui lòng nhập tóm tắt bài viết'),
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
  // Hàm tạo slug từ tiêu đề, thêm timestamp để đảm bảo tính duy nhất
  const generateUniqueSlug = (title: string): string => {
    // Nếu slug đã được cung cấp và không rỗng, sử dụng nó
    if (form.values.slug && form.values.slug.trim() !== '') {
      // Thêm timestamp để đảm bảo tính duy nhất
      return `${form.values.slug}-${Date.now()}`.toLowerCase();
    }
    
    // Nếu không, tạo slug từ tiêu đề
    const timestamp = Date.now();
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
      .replace(/[^\w\s-]/g, '') // Loại bỏ ký tự đặc biệt
      .replace(/[\s_]+/g, '-') // Thay thế khoảng trắng và gạch dưới bằng gạch nối
      .replace(/^-+|-+$/g, '') // Cắt gạch nối ở đầu và cuối
      .concat(`-${timestamp}`); // Thêm timestamp để đảm bảo tính duy nhất
  };

  const handleSubmit = async (values: PostFormValues) => {
    // Tạo FormData để gửi dữ liệu
    const formData = new FormData();
    
    // Tạo slug duy nhất
    const uniqueSlug = generateUniqueSlug(values.title);
    
    // Thêm các trường cơ bản
    formData.append('title', values.title);
    formData.append('slug', uniqueSlug);
    formData.append('content', values.content);
    formData.append('excerpt', values.excerpt);
    // Gửi isPublished dưới dạng boolean thay vì string
    formData.append('isPublished', values.isPublished ? 'true' : 'false');
    // Đảm bảo category là số
    formData.append('category', values.category);
    formData.append('author', values.author || '');
    
    // Thêm ngày xuất bản nếu có
    if (values.publishDate) {
      formData.append('publishedAt', values.publishDate.toISOString());
    }
    
    // Thêm tags nếu có
    if (values.tags) {
      formData.append('tags', values.tags);
    }
    
    // Chuyển đổi translations thành chuỗi JSON
    const translationsArray = Object.values(values.translations)
      .filter(trans => trans.title.trim() !== '' || trans.content.trim() !== '');
    
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
      navigate('/blog');
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
          Lưu bài viết
        </Button>
      </Group>
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Card shadow="sm" p="lg" radius="md" mb="xl">
          <Tabs defaultValue="general">
            <Tabs.List mb="md">
              <Tabs.Tab value="general">Thông tin chung</Tabs.Tab>
              <Tabs.Tab value="content">Nội dung</Tabs.Tab>
              <Tabs.Tab value="translations">Bản dịch</Tabs.Tab>
            </Tabs.List>
            
            <Tabs.Panel value="general">
              <Grid>
                <Grid.Col span={8}>
                  <Stack gap="md">
                    <TextInput
                      label="Tiêu đề bài viết"
                      placeholder="Nhập tiêu đề bài viết"
                      required
                      {...form.getInputProps('title')}
                    />
                    
                    <TextInput
                      label="Slug (URL)"
                      placeholder="nhap-tieu-de-bai-viet"
                      required
                      {...form.getInputProps('slug')}
                    />
                    
                    <Grid>
                      <Grid.Col span={6}>
                        <Select
                          label="Danh mục"
                          placeholder="Chọn danh mục"
                          data={categories}
                          searchable
                          clearable
                          {...form.getInputProps('category')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Tác giả"
                          placeholder="Nhập tên tác giả"
                          {...form.getInputProps('author')}
                        />
                      </Grid.Col>
                    </Grid>
                    
                    <Grid>
                      <Grid.Col span={6}>
                        <DatePickerInput
                          label="Ngày xuất bản"
                          placeholder="Chọn ngày xuất bản"
                          {...form.getInputProps('publishDate')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Tags"
                          placeholder="tag1, tag2, tag3"
                          description="Các tag phân cách bởi dấu phẩy"
                          {...form.getInputProps('tags')}
                        />
                      </Grid.Col>
                    </Grid>
                    
                    <Switch
                      label="Xuất bản"
                      description="Bài viết có được hiển thị trên trang chủ hay không"
                      {...form.getInputProps('isPublished', { type: 'checkbox' })}
                    />
                  </Stack>
                </Grid.Col>
                
                <Grid.Col span={4}>
                  <Paper shadow="sm" p="md" radius="md" withBorder>
                    <Stack>
                      <Text size="sm" fw={500}>Hình ảnh bài viết</Text>
                      
                      {imagePreview && (
                        <Image
                          radius="md"
                          src={imagePreview}
                          alt="Hình ảnh bài viết"
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
            
            <Tabs.Panel value="content">
              <Stack gap="md">
                <Textarea
                  label="Tóm tắt bài viết"
                  placeholder="Nhập tóm tắt bài viết"
                  required
                  minRows={3}
                  {...form.getInputProps('excerpt')}
                />
                
                <Textarea
                  label="Nội dung bài viết"
                  placeholder="Nhập nội dung chi tiết bài viết"
                  required
                  minRows={15}
                  {...form.getInputProps('content')}
                />
              </Stack>
            </Tabs.Panel>
            
            <Tabs.Panel value="translations">
              <Tabs defaultValue="vi">
                <Tabs.List mb="md">
                  <Tabs.Tab value="vi">Tiếng Việt</Tabs.Tab>
                  <Tabs.Tab value="en">Tiếng Anh</Tabs.Tab>
                  <Tabs.Tab value="zh">Tiếng Trung</Tabs.Tab>
                  <Tabs.Tab value="ko">Tiếng Hàn</Tabs.Tab>
                </Tabs.List>
                
                <Tabs.Panel value="vi">
                  <Stack gap="md">
                    <TextInput
                      label="Tiêu đề (Tiếng Việt)"
                      placeholder="Nhập tiêu đề bằng tiếng Việt"
                      {...form.getInputProps('translations.vi.title')}
                    />
                    <Textarea
                      label="Nội dung (Tiếng Việt)"
                      placeholder="Nhập nội dung bằng tiếng Việt"
                      minRows={10}
                      {...form.getInputProps('translations.vi.content')}
                    />
                  </Stack>
                </Tabs.Panel>
                
                <Tabs.Panel value="en">
                  <Stack gap="md">
                    <TextInput
                      label="Tiêu đề (Tiếng Anh)"
                      placeholder="Nhập tiêu đề bằng tiếng Anh"
                      {...form.getInputProps('translations.en.title')}
                    />
                    <Textarea
                      label="Nội dung (Tiếng Anh)"
                      placeholder="Nhập nội dung bằng tiếng Anh"
                      minRows={10}
                      {...form.getInputProps('translations.en.content')}
                    />
                  </Stack>
                </Tabs.Panel>
                
                <Tabs.Panel value="zh">
                  <Stack gap="md">
                    <TextInput
                      label="Tiêu đề (Tiếng Trung)"
                      placeholder="Nhập tiêu đề bằng tiếng Trung"
                      {...form.getInputProps('translations.zh.title')}
                    />
                    <Textarea
                      label="Nội dung (Tiếng Trung)"
                      placeholder="Nhập nội dung bằng tiếng Trung"
                      minRows={10}
                      {...form.getInputProps('translations.zh.content')}
                    />
                  </Stack>
                </Tabs.Panel>
                
                <Tabs.Panel value="ko">
                  <Stack gap="md">
                    <TextInput
                      label="Tiêu đề (Tiếng Hàn)"
                      placeholder="Nhập tiêu đề bằng tiếng Hàn"
                      {...form.getInputProps('translations.ko.title')}
                    />
                    <Textarea
                      label="Nội dung (Tiếng Hàn)"
                      placeholder="Nhập nội dung bằng tiếng Hàn"
                      minRows={10}
                      {...form.getInputProps('translations.ko.content')}
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
