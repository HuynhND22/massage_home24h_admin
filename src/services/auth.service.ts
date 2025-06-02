import axiosInstance from '../utils/axiosConfig';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const authService = {
  // Đăng nhập
  login: (credentials: LoginCredentials) => {
    return axiosInstance.post('/auth/login', credentials);
  },
  
  // Lấy thông tin người dùng hiện tại
  getCurrentUser: () => {
    return axiosInstance.get<UserProfile>('/auth/profile');
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
  
  // Cập nhật thông tin người dùng
  updateProfile: (data: Partial<UserProfile>) => {
    return axiosInstance.put('/auth/profile', data);
  },
  
  // Lấy danh sách người dùng (chỉ admin)
  getAllUsers: (page: number = 1, limit: number = 10) => {
    return axiosInstance.get(`/auth/users?page=${page}&limit=${limit}`);
  },
  
  // Xóa người dùng (chỉ admin)
  deleteUser: (userId: number) => {
    return axiosInstance.delete(`/auth/users/${userId}`);
  }
};
