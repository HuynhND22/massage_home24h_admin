import { useState } from 'react';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { Image, Group, Text, Button, Loader } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import axiosInstance from '../utils/axiosConfig';

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const res = await axiosInstance.post(
        'upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          params: { folder: 'uploads', preserveFilename: 'true' },
        }
      );
      // Giả sử API trả về { url: '...' }
      const data = res.data;
      if (data?.url) {
        setPreview(data.url);
        onChange?.(data.url);
      }
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (files: FileWithPath[]) => {
    const file = files[0];
    setPreview(URL.createObjectURL(file)); // Preview tạm thời
    handleUpload(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.('');
  };

  return (
    <div>
      {preview ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Image src={preview} alt="Preview" width={180} radius="md" />
          <Button size="xs" color="red" mt="xs" onClick={handleRemove} style={{ position: 'absolute', top: 0, right: 0 }}>
            Xóa
          </Button>
        </div>
      ) : (
        <Dropzone
          onDrop={onDrop}
          accept={IMAGE_MIME_TYPE}
          maxFiles={1}
          loading={uploading}
          multiple={false}
          maxSize={5 * 1024 ** 2}
        >
          <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload size={40} color="var(--mantine-color-blue-6)" stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={40} color="var(--mantine-color-red-6)" stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={40} color="var(--mantine-color-dimmed)" stroke={1.5} />
            </Dropzone.Idle>
            <div>
              <Text size="md" inline>
                Kéo thả hoặc click để chọn ảnh
              </Text>
              <Text size="xs" c="dimmed" inline mt={7}>
                Chỉ nhận 1 ảnh, tối đa 5MB
              </Text>
              {uploading && <Loader size="sm" mt={5} />}
            </div>
          </Group>
        </Dropzone>
      )}
    </div>
  );
} 