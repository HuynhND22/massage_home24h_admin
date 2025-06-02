import React, { createContext, useContext, useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { setLogoutCallback } from '../utils/axiosConfig';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
  });
  
  const navigate = useNavigate();

  // Đăng ký callback xử lý logout khi token hết hạn
  useEffect(() => {
    setLogoutCallback(() => {
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      navigate('/login');
    });
  }, [navigate]);

  // Kiểm tra token và load user nếu đã đăng nhập
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        // Kiểm tra token có hợp lệ không
        let decoded: any;
        try {
          decoded = jwtDecode(token);
        } catch (decodeError) {
          console.log('Invalid token format, clearing auth state');
          localStorage.removeItem('token');
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        const currentTime = Date.now() / 1000;
        if (!decoded.exp || decoded.exp < currentTime) {
          console.log('Token expired, clearing auth state');
          localStorage.removeItem('token');
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        // Tạm thời set authenticated = true với token hợp lệ
        setState({
          user: decoded,
          token,
          isAuthenticated: true,
          isLoading: true,
        });

        // Sau đó mới gọi API lấy thông tin user
        const response = await authService.getCurrentUser();
        setState({
          user: response.data,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error: any) {
        console.error('Error loading user:', error);
        // Chỉ xóa token nếu lỗi là 401
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } else {
          // Nếu là lỗi khác (như network), giữ nguyên trạng thái
          setState(prev => ({
            ...prev,
            isLoading: false
          }));
        }
      }
    };
    
    loadUser();
  }, []);

  // Đăng nhập
  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email, password: '***' });
      
      // Gọi API đăng nhập
      const response = await authService.login({ email, password });
      console.log('API response:', response);
      
      console.log('Full API response structure:', JSON.stringify(response.data, null, 2));
    
      let token, user;
      
      if (response.data.accessToken) {
        // Cấu trúc mới
        token = response.data.accessToken;
        user = response.data.user;
      } else if (response.data.data && response.data.data.token) {
        // Cấu trúc cũ
        token = response.data.data.token;
        user = response.data.data.user;
      } else {
        console.error('API response missing token or user data');
        return false;
      }
      
      // Xóa trước token cũ để tránh xung đột
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      // Lưu token mới vào localStorage
      localStorage.setItem('token', token);
      
      // Hiển thị thông báo đăng nhập thành công
      notifications.show({
        title: 'Đăng nhập thành công',
        message: 'Chào mừng bạn quay trở lại!',
        color: 'teal',
        autoClose: 2000,
      });

      // Cập nhật trạng thái của state
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      console.log('Login successful, token saved:', token.substring(0, 20) + '...');
      
      // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
      setTimeout(() => {
        navigate('/');
      }, 500);
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      
      notifications.show({
        title: 'Đăng nhập thất bại',
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập',
        color: 'red',
      });
      
      return false;
    }
  };

  // Đăng xuất
  const logout = () => {
    setLogoutCallback(null); // Hủy callback khi logout chủ động
    localStorage.removeItem('token');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
