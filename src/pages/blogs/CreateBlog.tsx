import { Container, LoadingOverlay, Paper, Title } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { blogService, IBlogCreate } from '../../services/blog.service';
import { BlogForm } from './components/BlogForm';
import { IBlogTranslation } from '../../interfaces/blog-translation.interface';
import { generateSlug } from '../../utils/string.utils';

export function CreateBlog() {
  const navigate = useNavigate();
  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.items || [];

  const { mutate: createBlog, isPending } = useMutation({
    mutationFn: async (data: IBlogCreate & { translations?: Partial<IBlogTranslation>[] }) => {
      // Log để debug
      console.log('Data received in mutation:', data);
      
      // Kiểm tra dữ liệu bắt buộc
      if (!data.title) {
        throw new Error('Title is required');
      }
      if (!data.content) {
        throw new Error('Content is required');
      }
      if (!data.categoryId) {
        throw new Error('Category is required');
      }

      // Tạo blog trước
      const blog = await blogService.create({
        title: data.title,
        description: data.description,
        content: data.content,
        slug: data.slug,
        categoryId: data.categoryId,
        imageFile: data.imageFile
      });

      // Nếu có translations thì tạo từng cái
      if (data.translations && blog.id) {
        await Promise.all(
          data.translations
            .filter(t => t.language && t.title && t.content)
            .map(t => blogService.createTranslation({
              blogId: blog.id,
              language: t.language!,
              title: t.title!,
              description: t.description || '',
              content: t.content!,
            }))
        );
      }
      return blog;
    },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Blog created successfully',
        color: 'green',
      });
      navigate('/blogs');
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create blog',
        color: 'red',
      });
    },
  });

  return (
    <Container size="xl">
      <Title order={2} mb="xl">Create New Blog</Title>
      <Paper p="md" pos="relative">
        <LoadingOverlay visible={isPending} />
        <BlogForm
          onSubmit={(values) => {
            const formData = {
              ...values,
              imageFile: values.imageFile || undefined
            };
            createBlog(formData);
          }}
          categories={categories.map((c: { id: string; name: string }) => ({ value: c.id, label: c.name }))}
        />
      </Paper>
    </Container>
  );
}
