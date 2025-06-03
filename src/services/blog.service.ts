import axiosInstance from '../utils/axiosConfig';
import { IBlog } from '../interfaces/blog.interface';
import { IBlogTranslation } from '../interfaces/blog-translation.interface';
import { IBlogCreate } from '../interfaces/blog.service.interface';
import { uploadService } from './upload.service';
import { AxiosError } from 'axios';

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
  create: async (data: IBlogCreate & { translations?: Partial<IBlogTranslation>[] }) => {
    try {
      let coverImage = data.coverImage || '';
      
      // 1. Nếu có file ảnh mới -> upload lên server
      if (data.imageFile) {
        const formData = new FormData();
        formData.append('file', data.imageFile);
        // 2. Gọi API upload -> trả về URL
        const uploadResponse = await uploadService.uploadImage(formData);
        console.log('Upload response:', uploadResponse);
        // 3. Lấy URL từ response và gán vào coverImage
        if (uploadResponse?.data?.url) {
          coverImage = uploadResponse.data.url;
          console.log('Cover image URL:', coverImage);
        }
      }

      // 4. Tạo blog với URL ảnh đã upload
      const blogData = {
        title: data.title?.trim() || '',
        description: data.description?.trim() || '',
        content: data.content?.trim() || '',
        slug: data.slug || '',
        categoryId: data.categoryId || '',
        coverImage // Gửi URL ảnh
      };

      console.log('Creating blog with data:', blogData);
      console.log('Request payload:', JSON.stringify(blogData, null, 2));

      const response = await axiosInstance.post('/blogs', blogData);
      console.log('Server response:', response.data);
      
      const blog = response.data;

      // Xử lý translations nếu có
      if (data.translations && blog.id) {
        await Promise.all(
          data.translations
            .filter(t => t.language && t.title && t.content)
            .map(t => blogService.createTranslation({
              blogId: blog.id,
              language: t.language!,
              title: t.title!,
              description: t.description || '',
              content: t.content!,
            }))
        );
      }

      return blog;
    } catch (error) {
      console.error('Error creating blog:', error);
      if (error instanceof AxiosError && error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },

  // Cập nhật blog
  update: async (id: string, data: Partial<IBlog> & { 
    imageFile?: File, 
    deleteImage?: boolean,
    translations?: Partial<IBlogTranslation>[] 
  }) => {
    try {
      let coverImage = data.coverImage;

      // 1. Xóa ảnh cũ nếu được yêu cầu
      if (data.deleteImage && data.coverImage) {
        await uploadService.deleteFile(data.coverImage);
        coverImage = '';
      }

      // 2. Nếu có file ảnh mới -> upload lên server
      if (data.imageFile) {
        const formData = new FormData();
        formData.append('file', data.imageFile);
        // 3. Gọi API upload -> trả về URL
        const uploadResponse = await uploadService.uploadImage(formData);
        console.log('Upload response:', uploadResponse);
        // 4. Lấy URL từ response và gán vào coverImage
        if (uploadResponse?.data?.url) {
          coverImage = uploadResponse.data.url;
          console.log('Cover image URL:', coverImage);
        }
      }

      // 5. Cập nhật blog với URL ảnh mới
      const blogData = {
        title: data.title?.trim(),
        description: data.description?.trim(),
        content: data.content?.trim(),
        categoryId: data.categoryId,
        coverImage // Gửi URL ảnh
      };

      console.log('Updating blog with data:', blogData);

      const response = await axiosInstance.patch(`/blogs/${id}`, blogData);
      const blog = response.data;

      // Xử lý translations nếu có
      if (data.translations && Array.isArray(data.translations)) {
        await Promise.all(
          data.translations
            .filter(t => t.language && t.title && t.content)
            .map(t => {
              if (t.id) {
                // Update existing translation
                return blogService.updateTranslation(t.id, {
                  title: t.title!,
                  description: t.description || '',
                  content: t.content!,
                });
              } else {
                // Create new translation
                return blogService.createTranslation({
                  blogId: id,
                  language: t.language!,
                  title: t.title!,
                  description: t.description || '',
                  content: t.content!,
                });
              }
            })
        );
      }

      return blog;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
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
