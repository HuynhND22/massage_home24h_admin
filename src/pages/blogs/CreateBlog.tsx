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
      // Tạo blog trước
      const blog = await blogService.create(data);
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
          onSubmit={createBlog}
          categories={categories.map((c: { id: string; name: string }) => ({ value: c.id, label: c.name }))}
        />
      </Paper>
    </Container>
  );
}
