import axiosInstance from '../utils/axiosConfig';
import { uploadService } from './upload.service';
import { ICategory } from '../interfaces/category.interface';

export const categoryService = {
  getAll: async (params?: { 
    page?: number; 
    limit?: number; 
    type?: string;
  }) => {
    const response = await axiosInstance.get('/categories', { 
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10
      }
    });
    return response;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: Partial<ICategory> & { imageFile?: File }) => {
    let coverImage = data.coverImage || '';
    
    // Upload image if provided
    if (data.imageFile) {
      const formData = new FormData();
      formData.append('file', data.imageFile);
      const uploadResponse = await uploadService.uploadImage(formData);
      coverImage = uploadResponse.url;
    }

    // Lấy translation tiếng Việt hoặc đầu tiên
    const viTranslation = (data.translations || []).find(t => t.language === 'vi') || data.translations?.[0] || { name: '', description: '' };

    // Ensure type is lowercase
    const categoryData = {
      name: viTranslation.name,
      description: viTranslation.description || '',
      type: data.type?.toLowerCase(),
      coverImage,
      translations: data.translations || []
    };
    
    const response = await axiosInstance.post('/categories', categoryData);
    return response;
  },

  update: async (id: string, data: Partial<ICategory> & { imageFile?: File, deleteImage?: boolean }) => {
    let coverImage = data.coverImage;
    if (data.deleteImage && data.coverImage) {
      await uploadService.deleteFile(data.coverImage);
      coverImage = '';
    }
    if (data.imageFile) {
      const formData = new FormData();
      formData.append('file', data.imageFile);
      const uploadResponse = await uploadService.uploadImage(formData);
      coverImage = uploadResponse.url;
    }
    // Lấy translation tiếng Việt hoặc đầu tiên
    const viTranslation = (data.translations || []).find(t => t.language === 'vi') || data.translations?.[0] || { name: '', description: '' };
    // Nếu không có coverImage mới, không truyền coverImage (giữ nguyên ảnh cũ)
    const categoryData: any = {
      name: viTranslation.name,
      description: viTranslation.description || '',
      type: data.type?.toLowerCase(),
      translations: data.translations || []
    };
    if (coverImage) {
      categoryData.coverImage = coverImage;
    }
    const response = await axiosInstance.patch(`/categories/${id}`, categoryData);
    return response;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  },

  updateOrder: async (items: { id: string; order: number }[]) => {
    const response = await axiosInstance.patch('/categories/order', { items });
    return response.data;
  },

  updateStatus: async (id: string, status: boolean) => {
    const response = await axiosInstance.patch(`/categories/${id}/status`, { status });
    return response.data;
  },

  restore: async (id: string) => {
    const response = await axiosInstance.post(`/categories/${id}/restore`);
    return response.data;
  },


};
