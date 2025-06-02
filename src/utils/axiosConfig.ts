import axios from 'axios';

// Cấu hình URL API endpoint
const baseURL = 'https://massage-home24h-api.onrender.com/api';

// Hàm xử lý logout
let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: (() => void) | null) => {
  logoutCallback = callback;
};

// Tạo instance axios với cấu hình cơ bản
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // Thêm timeout để tránh cho màn hình trắng quá lâu
});

// Interceptor để thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    // Nếu có token, thêm vào header Authorization
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
      // Log để debug
      console.log('Request with token:', config.url);
    } else {
      console.warn('No token found for request:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response và lỗi
axiosInstance.interceptors.response.use(
  (response) => {
    // Xử lý response thành công
    if (response.config.url?.includes('/auth/login') && import.meta.env.VITE_USE_LOCAL_STORAGE === 'true') {
      // Lưu token vào localStorage khi dev
      const token = response.data?.accessToken;
      if (token) {
        localStorage.setItem('token', token);
        console.log('Token saved to localStorage');
      }
    }
    
    if (response.config.url && !response.config.url.includes('/auth')) {
      console.log(`API Success [${response.config.method?.toUpperCase()}] ${response.config.url}:`, response.data);
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi response
    if (error.response) {
      // Nếu lỗi 401 và không phải trang login, chuyển hướng về trang đăng nhập
      if (error.response.status === 401 && !window.location.pathname.includes('/login')) {
        // Xóa token khi hết hạn
        localStorage.removeItem('token');
        if (logoutCallback) {
          logoutCallback();
        }
      }
      console.error(`API Error [${error.config?.method?.toUpperCase()}] ${error.config?.url}:`, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
