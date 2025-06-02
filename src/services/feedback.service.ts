import axiosInstance from '../utils/axiosConfig';

export interface IFeedback {
  id?: string;
  name: string;
  email: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

export const feedbackService = {
  getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await axiosInstance.get('/feedback', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(`/feedback/${id}`);
    return response.data;
  },

  create: async (data: Omit<IFeedback, 'id'>) => {
    const response = await axiosInstance.post('/feedback', data);
    return response.data;
  },

  update: async (id: string, data: Partial<IFeedback>) => {
    const response = await axiosInstance.patch(`/feedback/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/feedback/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: IFeedback['status']) => {
    const response = await axiosInstance.patch(`/feedback/${id}/status`, { status });
    return response.data;
  }
};
