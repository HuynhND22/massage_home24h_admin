import React, { useState } from 'react';
import { Modal, TextInput, Textarea, Button, Group, Stack, Select } from '@mantine/core';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await serviceService.createServiceDetail({ ...form, serviceId });
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
            onChange={handleLangChange}
            required
            placeholder="Chọn ngôn ngữ"
          />
          <Textarea
            label="Mô tả ngắn"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Nhập mô tả ngắn..."
            minRows={2}
          />
          <Textarea
            label="Nội dung chi tiết"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Nhập nội dung chi tiết..."
            minRows={4}
          />
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