import axios from 'axios';

// Cấu hình URL API endpoint
const baseURL = 'http://localhost:5000/api';

// Tạo instance axios với cấu hình cơ bản
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Thêm timeout để tránh cho màn hình trắng quá lâu
  withCredentials: false // Đặt false để tránh xung đột CORS
});

// Interceptor để thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    // Nếu có token, thêm vào header Authorization
    if (token) {
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
    if (response.config.url && !response.config.url.includes('/users')) {
      console.log(`API Success [${response.config.method?.toUpperCase()}] ${response.config.url}:`, response.data);
    }
    return response;
  },
  (error) => {
    // Xử lý các loại lỗi khác nhau
    if (error.response) {
      // Lỗi từ server (có response)
      console.error(`API Error [${error.response.status}]:`, error.response.data);
      
      // Xử lý lỗi 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        
        // Hiển thị thông báo và chuyển hướng sau 2 giây
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } else if (error.request) {
      // Lỗi mạng (không có response)
      console.error('Network Error:', error.request);
    } else {
      // Lỗi khác
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
