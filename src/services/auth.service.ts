import axiosInstance from '../utils/axiosConfig';

interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  login: (credentials: LoginCredentials) => {
    return axiosInstance.post('/users/login', credentials);
  },
  
  getCurrentUser: () => {
    return axiosInstance.get('/users/me');
  },
  
  register: (userData: any) => {
    return axiosInstance.post('/users/register', userData);
  },
};
