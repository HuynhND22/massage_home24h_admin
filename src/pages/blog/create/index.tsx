import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title } from '@mantine/core';
import { blogService } from '../../../services/blog.service';
import { showSuccessNotification } from '../../../utils/notificationUtils';
import { handleApiError } from '../../../utils/errorHandling';
import PostForm from '../../../components/blog/PostForm';

export default function CreatePost() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      await blogService.createPost(formData);
      showSuccessNotification('Bài viết mới', 'Đã tạo bài viết mới thành công');
      navigate('/blog');
    } catch (error) {
      handleApiError(error, 'Không thể tạo bài viết mới');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container size="xl">
      <Title order={2} mb="md">Tạo bài viết mới</Title>
      <PostForm 
        loading={loading}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}
