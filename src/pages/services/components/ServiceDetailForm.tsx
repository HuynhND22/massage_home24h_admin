import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Button, Group, Stack, Select } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import { useEditor as useTiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { notifications } from '@mantine/notifications';
import { ServiceDetailFormProps } from '../../../interfaces/service.interface';
import { serviceService } from '../../../services/service.service';

const LANGS = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
  { value: 'ko', label: '한국어' },
  { value: 'zh', label: '中文' },
];

const ServiceDetailForm: React.FC<ServiceDetailFormProps> = ({ opened, onClose, serviceId, detail }) => {
  const [form, setForm] = useState({
    title: detail?.title || '',
    description: detail?.description || '',
    content: detail?.content || '',
    language: detail?.language || 'vi',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tiptap editor instance cho RichTextEditor mô tả ngắn
  const editor = useEditor({
    extensions: [StarterKit],
    content: form.description,
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, description: editor.getHTML() }));
    },
  });

  // Tiptap editor instance cho RichTextEditor nội dung chi tiết
  const contentEditor = useTiptapEditor({
    extensions: [StarterKit],
    content: form.content,
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Đồng bộ lại content khi mở form hoặc detail thay đổi
  useEffect(() => {
    if (editor && opened) {
      editor.commands.setContent(detail?.description || '');
    }
    if (contentEditor && opened) {
      contentEditor.commands.setContent(detail?.content || '');
    }
    // eslint-disable-next-line
  }, [opened, detail, editor, contentEditor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLangChange = (value: string) => {
    setForm({ ...form, language: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!form.title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      setLoading(false);
      return;
    }
    if (!form.language) {
      setError('Vui lòng chọn ngôn ngữ');
      setLoading(false);
      return;
    }
    try {
      const payload = {
        ...form,
        serviceId,
      };
      console.log('Payload gửi lên:', JSON.stringify(payload, null, 2));
      await serviceService.createServiceDetail(payload);
      notifications.show({ title: 'Thành công', message: 'Đã tạo chi tiết dịch vụ!', color: 'green' });
      onClose(true);
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra');
      notifications.show({ title: 'Lỗi', message: err?.message || 'Có lỗi xảy ra', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      title: '',
      description: '',
      content: '',
      language: 'vi',
    });
    setError(null);
    onClose(false);
  };

  return (
    <Modal opened={opened} onClose={handleClose} title={detail ? 'Cập nhật chi tiết dịch vụ' : 'Tạo mới chi tiết dịch vụ'} centered>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Tiêu đề"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề..."
            required
            autoFocus
          />
          <Select
            label="Ngôn ngữ"
            name="language"
            data={LANGS}
            value={form.language}
            onChange={value => handleLangChange(value || 'vi')}
            required
            placeholder="Chọn ngôn ngữ"
          />
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, display: 'block' }}>Mô tả ngắn</label>
            <RichTextEditor editor={editor} style={{ minHeight: 80 }}>
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
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, display: 'block' }}>Nội dung chi tiết</label>
            <RichTextEditor editor={contentEditor} style={{ minHeight: 120 }}>
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
          </div>
          
          {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleClose} disabled={loading}>
              Đóng
            </Button>
            <Button type="submit" loading={loading} color="teal">
              {detail ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default ServiceDetailForm; 