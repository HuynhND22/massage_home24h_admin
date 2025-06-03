import axiosInstance from '../utils/axiosConfig';
import { LoginCredentials, RegisterData, UserProfile } from '../interfaces/user.interface';

export const authService = {
  // Đăng nhập
  login: (credentials: LoginCredentials) => {
    return axiosInstance.post('/auth/login', credentials);
  },
  
  // Lấy thông tin người dùng hiện tại
  getCurrentUser: () => {
    return axiosInstance.get<UserProfile>('/users/profile');
  },
  
  // Đăng ký
  register: (data: RegisterData) => {
    return axiosInstance.post('/auth/register', data);
  },
  
  // Đổi mật khẩu
  changePassword: (currentPassword: string, newPassword: string) => {
    return axiosInstance.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
  },
  
  // Cập nhật thông tin người dùng hiện tại
  updateProfile: (data: Partial<UserProfile>) => {
    return axiosInstance.put('/users/profile', data);
  },
  
  // Lấy danh sách người dùng (chỉ admin)
  getAllUsers: (page: number = 1, limit: number = 10) => {
    return axiosInstance.get(`/users?page=${page}&limit=${limit}`);
  },
  
  // Lấy user theo ID (chỉ admin)
  getUserById: (userId: number) => {
    return axiosInstance.get(`/users/${userId}`);
  },
  
  // Tạo user mới (chỉ admin)
  createUser: (data: RegisterData) => {
    return axiosInstance.post('/users', data);
  },
  
  // Cập nhật user (chỉ admin)
  updateUser: (userId: number, data: Partial<RegisterData>) => {
    return axiosInstance.patch(`/users/${userId}`, data);
  },
  
  // Xóa người dùng (chỉ admin)
  deleteUser: (userId: number) => {
    return axiosInstance.delete(`/users/${userId}`);
  },
  
  // Khôi phục user đã xóa (chỉ admin)
  restoreUser: (userId: number) => {
    return axiosInstance.post(`/users/${userId}/restore`);
  }
};
