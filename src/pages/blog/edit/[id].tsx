import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Title, LoadingOverlay } from '@mantine/core';
import { blogService } from '../../../services/blog.service';
import { showSuccessNotification, showErrorNotification } from '../../../utils/notificationUtils';
import { handleApiError, isValidId } from '../../../utils/errorHandling';
import PostForm, { PostFormValues } from '../../../components/blog/PostForm';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<PostFormValues>>({});
  const navigate = useNavigate();
  
  // Tải dữ liệu bài viết
  useEffect(() => {
    const fetchPost = async () => {
      // Kiểm tra ID có hợp lệ không
      if (!id || !isValidId(id)) {
        showErrorNotification('Lỗi', 'ID bài viết không hợp lệ');
        navigate('/blog');
        return;
      }
      
      try {
        setLoading(true);
        const response = await blogService.getPostById(parseInt(id));
        const post = response.data.data;
        
        // Tạo đối tượng translations với tất cả các ngôn ngữ
        const translations = {
          vi: { language: 'vi', title: '', content: '' },
          en: { language: 'en', title: '', content: '' },
          zh: { language: 'zh', title: '', content: '' },
          ko: { language: 'ko', title: '', content: '' },
        };
        
        // Cập nhật dữ liệu từ API vào đối tượng translations
        post.translations.forEach((translation: any) => {
          if (translation.language in translations) {
            translations[translation.language as keyof typeof translations] = {
              language: translation.language,
              title: translation.title,
              content: translation.content,
            };
          }
        });
        
        // Cập nhật giá trị ban đầu cho form
        setInitialValues({
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          isPublished: post.isPublished,
          publishDate: post.publishedAt ? new Date(post.publishedAt) : new Date(),
          category: post.categoryId ? post.categoryId.toString() : '',
          author: post.author || '',
          tags: post.tags ? post.tags.join(', ') : '',
          currentImageUrl: post.image,
          translations,
        });
      } catch (error) {
        handleApiError(error, 'Không thể tải thông tin bài viết');
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id, navigate]);
  
  // Xử lý khi submit form
  const handleSubmit = async (formData: FormData) => {
    if (!id || !isValidId(id)) {
      showErrorNotification('Lỗi', 'ID bài viết không hợp lệ');
      return;
    }
    
    try {
      setSubmitting(true);
      await blogService.updatePost(parseInt(id), formData);
      showSuccessNotification('Cập nhật', 'Đã cập nhật bài viết thành công');
      navigate('/blog');
    } catch (error) {
      handleApiError(error, 'Không thể cập nhật bài viết');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Container size="xl" style={{ position: 'relative', minHeight: '200px' }}>
        <LoadingOverlay visible={true} />
      </Container>
    );
  }
  
  return (
    <Container size="xl">
      <Title order={2} mb="md">Chỉnh sửa bài viết</Title>
      <PostForm 
        initialValues={initialValues}
        loading={submitting}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}
