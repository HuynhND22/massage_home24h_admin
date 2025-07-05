import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Button, Group, Stack, Select, Tabs } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import { useEditor as useTiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { notifications } from '@mantine/notifications';
import { ServiceDetailFormProps, IServiceDetail } from '../../../interfaces/service.interface';
import { serviceService } from '../../../services/service.service';
import { uploadService } from '../../../services/upload.service';

const LANGS = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'Tiếng Anh' },
  { value: 'ko', label: 'Tiếng Hàn' },
  { value: 'zh', label: 'Tiếng Trung' },
];

const ServiceDetailForm: React.FC<ServiceDetailFormProps> = ({ opened, onClose, serviceId, detail }) => {
  // State cho từng ngôn ngữ
  const [details, setDetails] = useState<{ language: string; title: string; description: string; content: string }[]>(() => {
    const result: { language: string; title: string; description: string; content: string }[] = [];
    LANGS.forEach(lang => {
      if (detail && detail.language === lang.value) {
        result.push({ language: lang.value, title: detail.title || '', description: detail.description || '', content: detail.content || '' });
      } else {
        result.push({ language: lang.value, title: '', description: '', content: '' });
      }
    });
    return result;
  });

  // State mới để lưu trữ id của details
  const [detailIds, setDetailIds] = useState<Record<string, string>>({});
  const [activeLang, setActiveLang] = useState('vi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tiptap editors cho từng ngôn ngữ
  const editors = LANGS.reduce((acc, lang) => {
    acc[lang.value] = useEditor({
      extensions: [
        StarterKit,
        Image,
        Link,
        Youtube.configure({
          controls: true,
          modestBranding: true,
          rel: 0,
        }),
      ],
      content: details.find(t => t.language === lang.value)?.description || '',
      onUpdate: ({ editor }) => {
        setDetails(prev => prev.map(t => t.language === lang.value ? { ...t, description: editor.getHTML() } : t));
      },
    });
    return acc;
  }, {} as Record<string, any>);

  const contentEditors = LANGS.reduce((acc, lang) => {
    acc[lang.value] = useTiptapEditor({
      extensions: [
        StarterKit,
        Image,
        Link,
        Youtube.configure({
          controls: true,
          modestBranding: true,
          rel: 0,
        }),
      ],
      content: details.find(t => t.language === lang.value)?.content || '',
      onUpdate: ({ editor }) => {
        setDetails(prev => prev.map(t => t.language === lang.value ? { ...t, content: editor.getHTML() } : t));
      },
    });
    return acc;
  }, {} as Record<string, any>);

  const handleImageUpload = async (file: File, editor: any) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadService.uploadImage(formData);
      editor.chain().focus().setImage({ src: res.data.url }).run();
      notifications.show({
        title: 'Thành công',
        message: 'Đã tải lên ảnh',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể tải lên ảnh',
        color: 'red',
      });
    }
  };

  const handleYoutubeEmbed = (editor: any) => {
    const url = prompt('Nhập URL video YouTube:');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  };

  useEffect(() => {
    let ignore = false;
    async function fetchDetails() {
      if (opened && serviceId) {
        setLoading(true);
        try {
          const res = await serviceService.getDetailsByServiceId(serviceId);
          const arr: IServiceDetail[] = 
            Array.isArray(res) ? res
            : Array.isArray(res.details) ? res.details
            : Array.isArray(res.data?.details) ? res.data.details
            : (res.data || res.items || []);

          // Cập nhật state details
          const newDetails = LANGS.map(lang => {
            const exist = arr.find(d => d.language === lang.value);
            return exist
              ? { language: lang.value, title: exist.title || '', description: exist.description || '', content: exist.content || '' }
              : { language: lang.value, title: '', description: '', content: '' };
          });
          setDetails(newDetails);

          // Lưu trữ id của details hiện có
          const ids: Record<string, string> = {};
          arr.forEach(detail => {
            if (detail.id && detail.language) {
              ids[detail.language] = detail.id;
            }
          });
          setDetailIds(ids);

          // Cập nhật nội dung cho các editor
          LANGS.forEach(lang => {
            const detail = newDetails.find(d => d.language === lang.value);
            if (editors[lang.value]) {
              editors[lang.value].commands.setContent(detail?.description || '');
            }
            if (contentEditors[lang.value]) {
              contentEditors[lang.value].commands.setContent(detail?.content || '');
            }
          });
        } catch (e) {
          setDetails(LANGS.map(lang => ({ language: lang.value, title: '', description: '', content: '' })));
          setDetailIds({});
        } finally {
          setLoading(false);
        }
      } else if (opened && !serviceId) {
        setDetails(LANGS.map(lang => ({ language: lang.value, title: '', description: '', content: '' })));
        setDetailIds({});
      }
      setActiveLang('vi');
      setError(null);
    }
    fetchDetails();
    return () => { ignore = true; };
    // eslint-disable-next-line
  }, [opened, serviceId]);

  const handleChange = (lang: string, field: 'title' | 'description' | 'content', value: string) => {
    setDetails(prev => prev.map(t => t.language === lang ? { ...t, [field]: value } : t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Lọc ra những ngôn ngữ có dữ liệu (có title hoặc content)
      const detailsToProcess = details.filter(item => 
        item.title.trim() || item.description?.trim() || item.content?.trim()
      );

      // Validate: ít nhất phải có 1 ngôn ngữ có đủ title và content
      const hasValidDetail = detailsToProcess.some(item => 
        item.title.trim() && item.content?.trim()
      );

      if (!hasValidDetail) {
        setError('Vui lòng nhập đầy đủ tiêu đề và nội dung chi tiết cho ít nhất một ngôn ngữ');
        setLoading(false);
        return;
      }

      // Xử lý từng ngôn ngữ có dữ liệu
      await Promise.all(detailsToProcess.map(async (item) => {
        const payload = {
          serviceId,
          language: item.language,
          title: item.title.trim(),
          description: item.description?.trim() || '',
          content: item.content?.trim() || ''
        };

        try {
          const existingId = detailIds[item.language];
          if (existingId) {
            // Nếu có id trong state -> update
            await serviceService.updateServiceDetail(existingId, payload);
          } else {
            // Không có id -> create
            await serviceService.createServiceDetail(payload);
          }
        } catch (err: any) {
          throw new Error(`Lỗi khi xử lý ngôn ngữ ${item.language}: ${err.message}`);
        }
      }));

      notifications.show({ 
        title: 'Thành công', 
        message: 'Đã lưu chi tiết dịch vụ cho các ngôn ngữ!', 
        color: 'green' 
      });
      onClose(true);
    } catch (err: any) {
      const errorMessage = err?.message || 'Có lỗi xảy ra khi lưu dữ liệu';
      setError(errorMessage);
      notifications.show({ 
        title: 'Lỗi', 
        message: errorMessage, 
        color: 'red' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDetails(LANGS.map(lang => ({ language: lang.value, title: '', description: '', content: '' })));
    setDetailIds({});
    setError(null);
    onClose(false);
  };

  return (
    <Modal opened={opened} onClose={handleClose} title={detail ? 'Cập nhật chi tiết dịch vụ' : 'Tạo mới chi tiết dịch vụ'} centered size="lg">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Tabs value={activeLang} onChange={val => setActiveLang(val as string)}>
            <Tabs.List>
              {LANGS.map(lang => (
                <Tabs.Tab value={lang.value} key={lang.value}>{lang.label}</Tabs.Tab>
              ))}
            </Tabs.List>
            {LANGS.map(lang => {
              const t = details.find(d => d.language === lang.value) || { title: '', description: '', content: '' };
              return (
                <Tabs.Panel value={lang.value} key={lang.value} pt="xs">
                  <TextInput
                    label="Tiêu đề"
                    name="title"
                    value={t.title}
                    onChange={e => handleChange(lang.value, 'title', e.target.value)}
                    placeholder="Nhập tiêu đề..."
                    required={lang.value === 'vi'}
                    autoFocus={lang.value === 'vi'}
                  />
                  <div style={{ marginTop: 12 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, display: 'block' }}>Mô tả ngắn</label>
                    <RichTextEditor editor={editors[lang.value]} style={{ minHeight: 80 }}>
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
                        <RichTextEditor.ControlsGroup>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, editors[lang.value]);
                            }}
                            id={`image-upload-${lang.value}-description`}
                          />
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => document.getElementById(`image-upload-${lang.value}-description`)?.click()}
                          >
                            Thêm ảnh
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleYoutubeEmbed(editors[lang.value])}
                          >
                            Thêm video
                          </Button>
                        </RichTextEditor.ControlsGroup>
                      </RichTextEditor.Toolbar>
                      <RichTextEditor.Content />
                    </RichTextEditor>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, display: 'block' }}>Nội dung chi tiết</label>
                    <RichTextEditor editor={contentEditors[lang.value]} style={{ minHeight: 120 }}>
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
                        <RichTextEditor.ControlsGroup>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, contentEditors[lang.value]);
                            }}
                            id={`image-upload-${lang.value}-content`}
                          />
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => document.getElementById(`image-upload-${lang.value}-content`)?.click()}
                          >
                            Thêm ảnh
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleYoutubeEmbed(contentEditors[lang.value])}
                          >
                            Thêm video
                          </Button>
                        </RichTextEditor.ControlsGroup>
                      </RichTextEditor.Toolbar>
                      <RichTextEditor.Content />
                    </RichTextEditor>
                  </div>
                </Tabs.Panel>
              );
            })}
          </Tabs>
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