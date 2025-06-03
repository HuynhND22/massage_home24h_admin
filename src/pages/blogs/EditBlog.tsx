import { Container, Paper, Title, LoadingOverlay } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { IBlog } from '../../interfaces/blog.interface';
import { IBlogTranslation } from '../../interfaces/blog-translation.interface';
import { blogService } from '../../services/blog.service';
import { BlogForm } from './components/BlogForm';

export function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.items || [];

  const { data: blog, isLoading: isBlogLoading } = useQuery<IBlog>({
    queryKey: ['blog', id],
    queryFn: () => blogService.getById(id!),
    enabled: !!id
  });

  // Lấy translations từ blog
  const translations = blog?.translations || [];

  const { mutate: updateBlog, isPending: isUpdating } = useMutation({
    mutationFn: async (values: Partial<IBlog & { imageFile?: File, translations?: Partial<IBlogTranslation>[] }>) => {
      if (!id) throw new Error('Blog ID is required');
      // Cập nhật blog chính
      await blogService.update(id, {
        ...values,
        deleteImage: !values.coverImage && !values.imageFile && !!blog?.coverImage
      });
      // Xử lý translations
      if (values.translations && Array.isArray(values.translations)) {
        await Promise.all(
          values.translations.filter(t => t.language && t.title && t.content).map(t => {
            if (t.id) {
              // Nếu có id thì update
              const { id: transId } = t;
              return blogService.updateTranslation(transId as string, {
                title: t.title!,
                description: t.description || '',
                content: t.content!,
              });
            } else {
              // Nếu chưa có id thì tạo mới
              return blogService.createTranslation({
                blogId: id,
                language: t.language!,
                title: t.title!,
                description: t.description || '',
                content: t.content!,
              });
            }
          })
        );
        // Refetch lại blog để lấy translations mới nhất
        await queryClient.invalidateQueries({ queryKey: ['blog', id] });
      }
    },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Blog updated successfully',
        color: 'green',
      });
      navigate('/blogs');
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update blog',
        color: 'red',
      });
    }
  });

  if (isBlogLoading) {
    return <LoadingOverlay visible />;
  }

  if (!blog) {
    return null;
  }

  return (
    <Container size="xl">
      <Title order={2} mb="xl">Edit Blog</Title>
      <Paper p="md" pos="relative">
        <LoadingOverlay visible={isUpdating} />
        <BlogForm
          initialValues={{
            ...blog,
            translations: (translations as Partial<IBlogTranslation>[])
          }}
          onSubmit={(values) => {
            const safeTranslations = Array.isArray(values.translations)
              ? values.translations.filter(
                  (t): t is IBlogTranslation =>
                    !!t.blogId &&
                    ['vi', 'ko', 'ru', 'zh', 'en'].includes(t.language as any) &&
                    !!t.title &&
                    !!t.content
                )
              : undefined;
            const formData = {
              ...values,
              imageFile: values.imageFile || undefined,
              deleteImage: !values.coverImage && !values.imageFile && !!blog?.coverImage,
              translations: safeTranslations
            };
            updateBlog(formData);
          }}
          categories={categories.map((c: { id: string; name: string }) => ({ value: c.id, label: c.name }))}
        />
      </Paper>
    </Container>
  );
}
