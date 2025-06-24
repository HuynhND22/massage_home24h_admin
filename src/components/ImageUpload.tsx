import { useState, useEffect } from 'react';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { Image, Group, Text, Button, Loader, Center } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';

interface ImageUploadProps {
  onChange?: (file: File | null) => void;
  uploading?: boolean;
  initialImage?: string | null;
}

export function ImageUpload({ onChange, uploading, initialImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      // setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange?.(file);
    }
  };

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    // setSelectedFile(null);
    onChange?.(null);
  };

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div>
      {uploading ? (
        <Center mih={120}>
          <Loader size="md" />
          <Text ml="sm">Đang upload ảnh...</Text>
        </Center>
      ) : preview ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Image src={preview} alt="Preview" width={180} radius="md" mt="md" />
          <Button size="xs" color="red" mt="xs" onClick={handleRemove} style={{ position: 'absolute', top: 0, right: 0 }}>
            Xóa
          </Button>
        </div>
      ) : (
        <Dropzone
          onDrop={onDrop}
          accept={IMAGE_MIME_TYPE}
          maxFiles={1}
          multiple={false}
          maxSize={5 * 1024 ** 2}
          mt="md"
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
            </div>
          </Group>
        </Dropzone>
      )}
    </div>
  );
} 