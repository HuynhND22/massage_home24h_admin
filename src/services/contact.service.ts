import axiosInstance from '../utils/axiosConfig';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const contactService = {
  // Lấy danh sách tin nhắn
  getAllMessages: (page = 1, limit = 10, isRead?: boolean) => {
    return axiosInstance.get<Message[]>(`/messages?page=${page}&limit=${limit}`, {
      params: { is_read: isRead }
    });
  },
  
  // Lấy chi tiết tin nhắn
  getMessageById: (id: number) => {
    return axiosInstance.get<Message>(`/messages/${id}`);
  },
  
  // Đánh dấu đã đọc
  markAsRead: (id: number) => {
    return axiosInstance.patch(`/messages/${id}/read`);
  },
  
  // Xóa tin nhắn
  deleteMessage: (id: number) => {
    return axiosInstance.delete(`/messages/${id}`);
  },
  
  // Đánh dấu tất cả đã đọc
  markAllAsRead: () => {
    return axiosInstance.patch('/messages/read-all');
  },
  
  // Xóa nhiều tin nhắn
  deleteMessages: (ids: number[]) => {
    return axiosInstance.post('/messages/delete', { ids });
  }
};
