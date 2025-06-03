import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { ISlide, SlideActionsProps } from '../../../interfaces/slide.interface';
import { slideService } from '../../../services/slide.service';

export function SlideActions({ slide, onEdit, onRefresh }: SlideActionsProps) {
  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Xác nhận xóa',
      children: 'Bạn có chắc chắn muốn xóa banner này?',
      labels: { confirm: 'Xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await slideService.delete(slide.id!);
          notifications.show({
            title: 'Thành công',
            message: 'Đã xóa banner',
            color: 'green',
          });
          onRefresh();
        } catch (error) {
          notifications.show({
            title: 'Lỗi',
            message: 'Không thể xóa banner',
            color: 'red',
          });
        }
      },
    });
  };

  return (
    <Group gap="xs">
      <Tooltip label="Sửa">
        <ActionIcon color="blue" onClick={() => onEdit(slide)}>
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