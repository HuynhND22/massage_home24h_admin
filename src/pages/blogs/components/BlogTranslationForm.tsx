import { Box, TextInput, Textarea, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { IBlogTranslation } from '../../../interfaces/blog-translation.interface';

interface BlogTranslationFormProps {
  initialValues?: Partial<IBlogTranslation>;
  onChange: (values: Partial<IBlogTranslation>) => void;
}

export function BlogTranslationForm({ initialValues, onChange }: BlogTranslationFormProps) {
  const form = useForm({
    initialValues: {
      language: initialValues?.language || 'en',
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      content: initialValues?.content || '',
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialValues?.content,
    onUpdate: ({ editor }) => {
      form.setFieldValue('content', editor.getHTML());
      onChange({
        ...form.values,
        content: editor.getHTML(),
      });
    },
  });

  const handleChange = (values: typeof form.values) => {
    onChange(values);
  };

  return (
    <Box>
      <Select
        label="Language"
        required
        data={[
          { value: 'en', label: 'English' },
          { value: 'vi', label: 'Tiếng Việt' },
          { value: 'ko', label: '한국어' },
          { value: 'ru', label: 'Русский' },
          { value: 'zh', label: '中文' },
        ]}
        {...form.getInputProps('language')}
        onChange={(value) => {
          form.setFieldValue('language', value as 'vi' | 'ko' | 'ru' | 'zh' | 'en');
          handleChange({ ...form.values, language: value as 'vi' | 'ko' | 'ru' | 'zh' | 'en' });
        }}
      />

      <TextInput
        label="Title"
        required
        mt="md"
        {...form.getInputProps('title')}
        onChange={(e) => {
          form.setFieldValue('title', e.target.value);
          handleChange({ ...form.values, title: e.target.value });
        }}
      />

      <Textarea
        label="Description"
        mt="md"
        {...form.getInputProps('description')}
        onChange={(e) => {
          form.setFieldValue('description', e.target.value);
          handleChange({ ...form.values, description: e.target.value });
        }}
      />

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
    </Box>
  );
}
