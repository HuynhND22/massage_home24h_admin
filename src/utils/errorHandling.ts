import { AxiosError } from 'axios';
import { showErrorNotification } from './notificationUtils';

/**
 * Xử lý lỗi API một cách thống nhất
 * @param error Lỗi từ axios
 * @param defaultMessage Thông báo mặc định nếu không có thông tin chi tiết
 */
export const handleApiError = (error: unknown, defaultMessage = 'Đã xảy ra lỗi, vui lòng thử lại sau') => {
  console.error('API Error:', error);
  
  if (error instanceof AxiosError) {
    const responseData = error.response?.data;
    
    // Kiểm tra xem API có trả về thông báo lỗi cụ thể không
    if (responseData && responseData.message) {
      showErrorNotification('Lỗi', responseData.message);
      return;
    }
    
    // Xử lý các mã lỗi HTTP phổ biến
    const statusCode = error.response?.status;
    
    switch (statusCode) {
      case 400:
        showErrorNotification('Lỗi dữ liệu', 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại');
        break;
      case 401:
        showErrorNotification('Chưa đăng nhập', 'Phiên làm việc đã hết hạn, vui lòng đăng nhập lại');
        // Có thể thêm logic chuyển hướng về trang đăng nhập ở đây
        break;
      case 403:
        showErrorNotification('Không có quyền', 'Bạn không có quyền thực hiện thao tác này');
        break;
      case 404:
        showErrorNotification('Không tìm thấy', 'Dữ liệu không tồn tại hoặc đã bị xóa');
        break;
      case 422:
        showErrorNotification('Lỗi dữ liệu', 'Dữ liệu không đúng định dạng, vui lòng kiểm tra lại');
        break;
      case 500:
        showErrorNotification('Lỗi máy chủ', 'Lỗi máy chủ, vui lòng thử lại sau');
        break;
      default:
        showErrorNotification('Lỗi', defaultMessage);
    }
  } else {
    showErrorNotification('Lỗi', defaultMessage);
  }
};

/**
 * Kiểm tra ID có hợp lệ không
 * @param id ID cần kiểm tra
 * @returns true nếu ID hợp lệ
 */
export const isValidId = (id: string | number | undefined | null): boolean => {
  if (id === undefined || id === null) return false;
  
  const numericId = typeof id === 'string' ? parseInt(id) : id;
  return !isNaN(numericId) && numericId > 0;
};
