import axiosInstance from '../utils/axiosConfig';
import { IWebSettings } from '../interfaces/webSettings.interface';

export const webSettingsService = {
  getAll: async () => {
    const res = await axiosInstance.get('/web-settings');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await axiosInstance.get(`/web-settings/${id}`);
    return res.data;
  },
  create: async (data: Partial<IWebSettings> & { logoFile?: File }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'logoFile' && value instanceof File) {
          formData.append('logo', value);
        } else if (key !== 'logoFile') {
          formData.append(key, value === null ? '' : value as string);
        }
      }
    });
    const res = await axiosInstance.post('/web-settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  update: async (id: string, data: Partial<IWebSettings> & { logoFile?: File }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'logoFile' && value instanceof File) {
          formData.append('logo', value);
        } else if (key !== 'logoFile') {
          formData.append(key, value === null ? '' : value as string);
        }
      }
    });
    const res = await axiosInstance.patch(`/web-settings/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.delete(`/web-settings/${id}`);
    return res.data;
  },
}; 