import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { IBlog } from '../../../interfaces/blog.interface';
import { blogService } from '../../../services/blog.service';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

interface BlogActionsProps {
  blog: IBlog;
  onEdit: (blog: IBlog) => void;
  onRefresh: () => void;
}

export function BlogActions({ blog, onEdit, onRefresh }: BlogActionsProps) {
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
    <Group gap="xs">
      <Tooltip label="Sửa">
        <ActionIcon color="blue" onClick={() => onEdit(blog)}>
          <IconEdit size={18} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Xóa">
        <ActionIcon color="red" onClick={handleDelete}>
          <IconTrash size={18} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
} 