import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { CategoryActionsProps } from '../../../interfaces/category.interface';
import { categoryService } from '../../../services/category.service';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';

export function CategoryActions({ category, onEdit, onRefresh }: CategoryActionsProps) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Xác nhận xóa',
      children: 'Bạn có chắc chắn muốn xóa danh mục này?',
      labels: { confirm: 'Xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await categoryService.delete(category.id!);
          notifications.show({
            title: 'Thành công',
            message: 'Đã xóa danh mục',
            color: 'green',
          });
          onRefresh();
        } catch (error) {
          notifications.show({
            title: 'Lỗi',
            message: 'Không thể xóa danh mục',
            color: 'red',
          });
        }
      },
    });
  };

  return (
    <Group gap={isMobile ? 4 : 'xs'}>
      <Tooltip label="Sửa">
        <ActionIcon color="blue" onClick={() => onEdit(category)} size={isMobile ? 'md' : 'sm'}>
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