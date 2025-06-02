import axiosInstance from '../utils/axiosConfig';

export interface ISlice {
  id?: string;
  title: string;
  description?: string;
  image?: string;
  order?: number;
  status: boolean;
  link?: string;
  type: 'banner' | 'promotion' | 'about' | 'feature';
  createdAt?: Date;
  updatedAt?: Date;
}

export const sliceService = {
  getAll: async (params?: { page?: number; limit?: number; type?: string }) => {
    const response = await axiosInstance.get('/slices', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(`/slices/${id}`);
    return response.data;
  },

  create: async (data: Omit<ISlice, 'id'>) => {
    const response = await axiosInstance.post('/slices', data);
    return response.data;
  },

  update: async (id: string, data: Partial<ISlice>) => {
    const response = await axiosInstance.patch(`/slices/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/slices/${id}`);
    return response.data;
  },

  updateOrder: async (items: { id: string; order: number }[]) => {
    const response = await axiosInstance.patch('/slices/order', { items });
    return response.data;
  },

  updateStatus: async (id: string, status: boolean) => {
    const response = await axiosInstance.patch(`/slices/${id}/status`, { status });
    return response.data;
  }
};
