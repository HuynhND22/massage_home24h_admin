import axiosInstance from '../utils/axiosConfig';
import { ISlide } from '../interfaces/slide.interface';

export const slideService = {
  getAll: async (params?: { page?: number; limit?: number; role?: string }) => {
    const response = await axiosInstance.get('/slides', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(`/slides/${id}`);
    return response.data;
  },

  create: async (data: Omit<ISlide, 'id'>) => {
    // Log payload for debugging
    console.log('slideService.create payload:', data);
    const response = await axiosInstance.post('/slides', data);
    return response.data;
  },

  update: async (id: string, data: Partial<ISlide>) => {
    const response = await axiosInstance.patch(`/slides/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/slides/${id}`);
    return response.data;
  },

  updateOrder: async (items: { id: string; order: number }[]) => {
    const response = await axiosInstance.patch('/slides/order', { items });
    return response.data;
  },
};
