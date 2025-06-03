import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ICategory, categoryService } from '../../../services/category.service';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

interface CategoryActionsProps {
  category: ICategory;
  onEdit: (category: ICategory) => void;
  onRefresh: () => void;
}

export function CategoryActions({ category, onEdit, onRefresh }: CategoryActionsProps) {
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
    <Group gap="xs">
      <Tooltip label="Sửa">
        <ActionIcon color="blue" onClick={() => onEdit(category)}>
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