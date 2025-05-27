import axiosInstance from '../utils/axiosConfig';

export const blogService = {
  getAllPosts: (page = 1, limit = 10, language?: string, publishedOnly = false) => {
    return axiosInstance.get('/blog', {
      params: { page, limit, language, publishedOnly },
    });
  },
  
  getPostById: (id: number, language?: string) => {
    const params = language ? { language } : {};
    return axiosInstance.get(`/blog/${id}`, { params });
  },
  
  createPost: (postData: FormData) => {
    return axiosInstance.post('/blog', postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updatePost: (id: number, postData: FormData) => {
    return axiosInstance.put(`/blog/${id}`, postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deletePost: (id: number) => {
    return axiosInstance.delete(`/blog/${id}`);
  },
  
  togglePublishStatus: (id: number) => {
    return axiosInstance.patch(`/blog/${id}/toggle-publish`);
  },
  
  getCategories: () => {
    return axiosInstance.get('/categories');
  },
  
  getCategoryById: (id: number) => {
    return axiosInstance.get(`/categories/${id}`);
  },
  
  createCategory: (categoryData: any) => {
    return axiosInstance.post('/categories', categoryData);
  },
  
  updateCategory: (id: number, categoryData: any) => {
    return axiosInstance.put(`/categories/${id}`, categoryData);
  },
  
  deleteCategory: (id: number) => {
    return axiosInstance.delete(`/categories/${id}`);
  },
};
