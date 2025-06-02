import { Box, Button, TextInput, Textarea, Group, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import { IBlogCreate } from '../../../services/blog.service';
import { IBlogTranslation } from '../../../interfaces/blog-translation.interface';
import { BlogTranslations } from './BlogTranslations';
import { ImageUpload } from '../../../components/ImageUpload';

interface BlogFormProps {
  initialValues?: Partial<IBlogCreate & { translations?: Partial<IBlogTranslation>[] }>;
  onSubmit: (values: IBlogCreate & { translations?: Partial<IBlogTranslation>[] }) => void;
  categories: { value: string; label: string }[];
}

export function BlogForm({ initialValues, onSubmit, categories }: BlogFormProps) {
  const form = useForm<IBlogCreate & { translations?: Partial<IBlogTranslation>[] }>({
    initialValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      content: initialValues?.content || '',
      slug: initialValues?.slug || '',
      categoryId: initialValues?.categoryId || '',
      imageFile: undefined,
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
      coverImage: initialValues?.coverImage,
    });
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Title"
        required
        {...form.getInputProps('title')}
      />

      <Textarea
        label="Description"
        mt="md"
        {...form.getInputProps('description')}
      />

      <Select
        label="Category"
        required
        mt="md"
        data={categories}
        {...form.getInputProps('categoryId')}
      />

      <Box mt="md">
        <ImageUpload
          value={initialValues?.coverImage || ''}
          onChange={(url: string) => form.setFieldValue('coverImage', url)}
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
          onChange={(translations) => form.setFieldValue('translations', translations)}
        />
      </Box>

      <Group justify="flex-end" mt="xl">
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
}
