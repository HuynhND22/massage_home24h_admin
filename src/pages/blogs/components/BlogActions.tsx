import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { blogService } from '../../../services/blog.service';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';

interface BlogActionsProps {
  blog: any; // Replace 'any' with your actual blog type if available
  onEdit: (blog: any) => void; // Adjust type as needed
  onRefresh: () => void;
}

export function BlogActions({ blog, onEdit, onRefresh }: BlogActionsProps) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Xác nhận xóa',
      children: 'Bạn có chắc chắn muốn xóa bài viết này?',
      labels: { confirm: 'Xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await blogService.delete(blog.id!);
          notifications.show({
            title: 'Thành công',
            message: 'Đã xóa bài viết',
            color: 'green',
          });
          onRefresh();
        } catch (error) {
          notifications.show({
            title: 'Lỗi',
            message: 'Không thể xóa bài viết',
            color: 'red',
          });
        }
      },
    });
  };

  return (
    <Group gap={isMobile ? 4 : 'xs'}>
      <Tooltip label="Sửa">
        <ActionIcon color="blue" onClick={() => onEdit(blog)} size={isMobile ? 'md' : 'sm'}>
          <IconEdit size={18} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Xóa">
        <ActionIcon color="red" onClick={handleDelete} size={isMobile ? 'md' : 'sm'}>
          <IconTrash size={18} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
} 