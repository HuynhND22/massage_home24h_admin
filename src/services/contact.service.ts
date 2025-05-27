import axiosInstance from '../utils/axiosConfig';

export const contactService = {
  getAllContacts: (page = 1, limit = 10, isRead?: boolean) => {
    const params: any = { page, limit };
    if (isRead !== undefined) {
      params.isRead = isRead;
    }
    return axiosInstance.get('/contact', { params });
  },
  
  getContactById: (id: number) => {
    return axiosInstance.get(`/contact/${id}`);
  },
  
  markAsRead: (id: number) => {
    return axiosInstance.patch(`/contact/${id}/read`);
  },
  
  deleteContact: (id: number) => {
    return axiosInstance.delete(`/contact/${id}`);
  },
};
