import axiosInstance from '../utils/axiosConfig';

export const serviceService = {
  getAllServices: (language?: string) => {
    const params = language ? { language } : {};
    return axiosInstance.get('/services', { params });
  },
  
  getServiceById: (id: number, language?: string) => {
    const params = language ? { language } : {};
    return axiosInstance.get(`/services/${id}`, { params });
  },
  
  createService: (serviceData: FormData) => {
    return axiosInstance.post('/services', serviceData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updateService: (id: number, serviceData: FormData) => {
    return axiosInstance.put(`/services/${id}`, serviceData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteService: (id: number) => {
    return axiosInstance.delete(`/services/${id}`);
  },
};
