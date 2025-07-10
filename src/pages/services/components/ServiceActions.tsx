import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash, IconFilePlus, IconEye } from '@tabler/icons-react';
import { ServiceActionsProps } from '../../../interfaces/service.interface';
import { serviceService } from '../../../services/service.service';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';
import ServiceDetailForm from './ServiceDetailForm';
import ServiceViewModal from './ServiceViewModal';

export function ServiceActions({ service, onEdit, onRefresh }: ServiceActionsProps) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [openDetailForm, setOpenDetailForm] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);

  const handleOpenInApp = () => {
    const deepLink = `massage24h://service/${service.id}`;
    const webLink = `/services/${service.id}`;
    
    // Check if on mobile
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // Create iframe for deep link
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = deepLink;
      document.body.appendChild(iframe);
      
      // Remove iframe after attempt
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 500);
      
      // Fallback to web link after 1 second if deep link fails
      setTimeout(() => {
        window.location.href = webLink;
      }, 1000);
    } else {
      // On desktop, just open web link
      window.location.href = webLink;
    }
  };

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
    <>
      <Group gap={isMobile ? 4 : 'xs'}>
        <Tooltip label="Xem chi tiết">
          <ActionIcon color="gray" onClick={handleOpenInApp} size={isMobile ? 'md' : 'sm'}>
            <IconEye size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Sửa">
          <ActionIcon color="blue" onClick={() => onEdit(service)} size={isMobile ? 'md' : 'sm'}>
            <IconEdit size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Tạo chi tiết dịch vụ">
          <ActionIcon color="teal" onClick={() => setOpenDetailForm(true)} size={isMobile ? 'md' : 'sm'}>
            <IconFilePlus size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Xóa">
          <ActionIcon color="red" onClick={handleDelete} size={isMobile ? 'md' : 'sm'}>
            <IconTrash size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
      <ServiceDetailForm
        opened={openDetailForm}
        onClose={(refresh) => {
          setOpenDetailForm(false);
          if (refresh) onRefresh();
        }}
        serviceId={service.id!}
      />
      {openView && (
        <ServiceViewModal service={service} opened={openView} onClose={() => setOpenView(false)} />
      )}
    </>
  );
} 