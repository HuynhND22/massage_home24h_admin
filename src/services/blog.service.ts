import axiosInstance from '../utils/axiosConfig';
import { IBlog } from '../interfaces/blog.interface';
import { IBlogTranslation } from '../interfaces/blog-translation.interface';

import { generateSlug } from '../utils/string.utils';

export interface IBlogCreate {
  title: string;
  description?: string;
  content: string;
  slug: string;
  categoryId: string;
  imageFile?: File;
  coverImage?: string;
}

export const blogService = {
  // Lấy danh sách blog
  getAll: async ({ 
    page = 1, 
    limit = 10, 
    categoryId,
    search,
    sortBy,
    sortOrder = 'DESC'
  }: { 
    page?: number; 
    limit?: number; 
    categoryId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  } = {}) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (categoryId) params.append('categoryId', categoryId);
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    
    const response = await axiosInstance.get(`/blogs?${params.toString()}`);
    return response.data;
  },

  getAllTranslations: async (blogId: string) => {
    const response = await axiosInstance.get(`/blogs/translations/${blogId}`);
    return response.data;
  },

  // Lấy blog theo slug
  getBySlug: async (slug: string) => {
    const response = await axiosInstance.get(`/blogs/slug/${slug}`);
    return response.data;
  },

  // Lấy blog theo id
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/blogs/${id}`);
    return response.data;
  },

  // Tạo mới blog
  create: async (data: {
    title: string;
    description?: string;
    content: string;
    slug: string;
    categoryId: string;
    imageFile?: File;
  }) => {
    try {
      console.log('Blog data received:', data);
      if (data.imageFile) {
        const formData = new FormData();
        const blogData = {
          title: data.title.trim(),
          description: data.description?.trim(),
          content: data.content.trim(),
          slug: data.slug,
          categoryId: data.categoryId
        };
        
        console.log('Sending blog data as JSON:', blogData);
        
        formData.append('data', JSON.stringify(blogData));
        formData.append('file', data.imageFile);
        
        console.log('FormData created with file');
        
        const response = await axiosInstance.post('/blogs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        const blogData = {
          title: data.title.trim(),
          description: data.description?.trim(),
          content: data.content.trim(),
          slug: data.slug,
          categoryId: data.categoryId
        };
        
        console.log('Sending blog data without image:', blogData);
        
        const response = await axiosInstance.post('/blogs', blogData);
        return response.data;
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },

  // Cập nhật blog
  update: async (id: string, data: Partial<IBlog> & { imageFile?: File, deleteImage?: boolean, translations?: Partial<IBlogTranslation>[] }) => {
    const formData = new FormData();
    
    const blogData = {
      title: data.title?.trim(),
      description: data.description?.trim(),
      content: data.content?.trim(),
      categoryId: data.categoryId,
      coverImage: data.coverImage,
      deleteImage: data.deleteImage,
      translations: data.translations?.map(trans => ({
        ...trans,
        slug: generateSlug(trans.title || '')
      }))
    };

    formData.append('data', JSON.stringify(blogData));
    if (data.imageFile) {
      formData.append('file', data.imageFile);
    }

    const response = await axiosInstance.patch(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Xóa blog (soft delete)
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/blogs/${id}`);
    return response.data;
  },

  // Khôi phục blog đã xóa
  restore: async (id: string) => {
    const response = await axiosInstance.patch(`/blogs/${id}/restore`);
    return response.data;
  },

  // Tạo bản dịch cho blog
  createTranslation: async (data: IBlogTranslation) => {
    const response = await axiosInstance.post('/blogs/translations', data);
    return response.data;
  },

  // Cập nhật bản dịch cho blog
  updateTranslation: async (id: string, data: Partial<IBlogTranslation>) => {
    const response = await axiosInstance.patch(`/blogs/translations/${id}`, data);
    return response.data;
  }
};
