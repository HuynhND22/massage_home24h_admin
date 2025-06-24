import { Box, Button, TextInput, Textarea, Group, Select, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import { BlogFormProps } from '../../../interfaces/blog.interface';
import { IBlogCreate } from '../../../interfaces/blog.service.interface';
import { IBlogTranslation } from '../../../interfaces/blog-translation.interface';
import { BlogTranslations } from './BlogTranslations';
import { ImageUpload } from '../../../components/ImageUpload';
import { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import StarterKit from '@tiptap/starter-kit';

export function BlogForm({ initialValues, onSubmit, categories }: BlogFormProps) {
  const [uploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(initialValues?.coverImage || null);
  const isMobile = useMediaQuery('(max-width: 600px)');

  const form = useForm<IBlogCreate & { translations?: IBlogTranslation[] }>({
    initialValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      content: initialValues?.content || '',
      slug: initialValues?.slug || '',
      categoryId: initialValues?.categoryId || '',
      coverImage: initialValues?.coverImage || '',
      translations: initialValues?.translations || []
    },
    validate: {
      title: (value) => !value ? 'Tiêu đề không được để trống' : null,
      content: (value) => !value ? 'Nội dung không được để trống' : null,
      categoryId: (value) => !value ? 'Danh mục không được để trống' : null,
    }
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialValues?.content,
    onUpdate: ({ editor }) => {
      form.setFieldValue('content', editor.getHTML());
    },
  });

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setCoverImage(null);
    } else {
      setImageFile(null);
      setCoverImage(null);
    }
  };

  const handleSubmit = form.onSubmit((values) => {
    const slug = values.title
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-') || '';

    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description?.trim(),
      content: values.content.trim(),
      slug,
      coverImage: imageFile ? undefined : (coverImage || initialValues?.coverImage || ''),
      translations: (values.translations as IBlogTranslation[]) || []
    });
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Tiêu đề"
          placeholder="Nhập tiêu đề bài viết"
          required
          {...form.getInputProps('title')}
          style={isMobile ? { width: '100%' } : {}}
        />

        <Textarea
          label="Mô tả"
          placeholder="Nhập mô tả ngắn cho bài viết"
          mt="md"
          {...form.getInputProps('description')}
          style={isMobile ? { width: '100%' } : {}}
        />

        <Select
          label="Danh mục"
          placeholder="Chọn danh mục"
          required
          mt="md"
          data={categories}
          {...form.getInputProps('categoryId')}
          style={isMobile ? { width: '100%' } : {}}
        />

        <Box mt="md">
          <ImageUpload
            onChange={handleImageChange}
            uploading={uploading}
            initialImage={coverImage || initialValues?.coverImage}
          />
        </Box>

        <Box mt="md">
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>
        </Box>

        <Box mt="xl">
          <BlogTranslations
            translations={form.values.translations || []}
            onChange={(translations) =>
              form.setFieldValue('translations', translations as IBlogTranslation[])
            }
          />
        </Box>

        <Group justify="flex-end" mt="xl" style={isMobile ? { flexDirection: 'column', gap: 8 } : {}}>
          <Button type="submit" loading={uploading} fullWidth={isMobile}>Lưu bài viết</Button>
        </Group>
      </Stack>
    </form>
  );
}
