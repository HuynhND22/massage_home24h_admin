import axiosInstance from '../utils/axiosConfig';
import { IService, IServiceDetail } from '../interfaces/service.interface';

export const serviceService = {
  // Lấy danh sách dịch vụ
  getAll: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    categoryId?: string;
    includeDeleted?: boolean;
  }) => {
    // Chỉ truyền các params hợp lệ
    const filteredParams: Record<string, any> = {};
    if (params.page) filteredParams.page = params.page;
    if (params.limit) filteredParams.limit = params.limit;
    if (params.search) filteredParams.search = params.search;
    if (params.sortBy) filteredParams.sortBy = params.sortBy;
    if (params.sortOrder) filteredParams.sortOrder = params.sortOrder;
    if (params.categoryId) filteredParams.categoryId = params.categoryId;
    if (typeof params.includeDeleted === 'boolean') filteredParams.includeDeleted = params.includeDeleted;
    const response = await axiosInstance.get('/services', { params: filteredParams });
    return response.data;
  },
  
  // Lấy chi tiết dịch vụ
  getById: async (id: string, includeDeleted: boolean = false) => {
    const response = await axiosInstance.get(`/services/${id}`, { params: { includeDeleted } });
    return response.data;
  },
  
  // Tạo mới dịch vụ
  create: async (data: Omit<IService, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await axiosInstance.post('/services', data);
    return response.data;
  },
  
  // Cập nhật dịch vụ
  update: async (id: string, data: Partial<Omit<IService, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const response = await axiosInstance.patch(`/services/${id}`, data);
    return response.data;
  },
  
  // Xóa dịch vụ
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/services/${id}`);
    return response.data;
  },

  // Lấy chi tiết dịch vụ theo slug
  getDetailsBySlug: async (slug: string) => {
    const response = await axiosInstance.get(`/services/details/${slug}`);
    return response.data;
  },

  // Tạo mới service detail
  createServiceDetail: async (data: Omit<IServiceDetail, 'id'>) => {
    const response = await axiosInstance.post('/services/details', data);
    return response.data;
  },

  // Lấy danh sách service detail theo serviceId
  getDetailsByServiceId: async (serviceId: string) => {
    const response = await axiosInstance.get('/services/details/'+serviceId);
    return response.data;
  },
};
