import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { IService, serviceService } from '../../../services/service.service';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

interface ServiceActionsProps {
  service: IService;
  onEdit: (service: IService) => void;
  onRefresh: () => void;
}

export function ServiceActions({ service, onEdit, onRefresh }: ServiceActionsProps) {
  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Xác nhận xóa',
      children: 'Bạn có chắc chắn muốn xóa dịch vụ này?',
      labels: { confirm: 'Xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await serviceService.delete(service.id!);
          notifications.show({ title: 'Thành công', message: 'Đã xóa dịch vụ', color: 'green' });
          onRefresh();
        } catch (error) {
          notifications.show({ title: 'Lỗi', message: 'Không thể xóa dịch vụ', color: 'red' });
        }
      },
    });
  };

  return (
    <Group gap="xs">
      <Tooltip label="Sửa">
        <ActionIcon color="blue" onClick={() => onEdit(service)}>
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