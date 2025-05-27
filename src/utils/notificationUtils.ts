import { notifications } from '@mantine/notifications';

export const showSuccessNotification = (title = 'Thành công', message: string) => {
  notifications.show({
    title,
    message,
    color: 'green',
    autoClose: 3000,
  });
};

export const showErrorNotification = (title = 'Lỗi', message: string) => {
  notifications.show({
    title,
    message,
    color: 'red',
    autoClose: 5000,
  });
};

export const showWarningNotification = (title = 'Cảnh báo', message: string) => {
  notifications.show({
    title,
    message,
    color: 'orange',
    autoClose: 4000,
  });
};

export const showLoadingNotification = (id: string, message = 'Đang xử lý...') => {
  notifications.show({
    id,
    loading: true,
    title: 'Đang xử lý',
    message,
    autoClose: false,
    withCloseButton: false,
  });
};

export const updateLoadingNotification = (id: string, success: boolean, message: string) => {
  if (success) {
    notifications.update({
      id,
      color: 'green',
      title: 'Thành công',
      message,
      icon: null,
      loading: false,
      autoClose: 3000,
    });
  } else {
    notifications.update({
      id,
      color: 'red',
      title: 'Lỗi',
      message,
      icon: null,
      loading: false,
      autoClose: 4000,
    });
  }
};
