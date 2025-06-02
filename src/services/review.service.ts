import axiosInstance from '../utils/axiosConfig';

interface Review {
  id: number;
  user_id: number;
  service_id: number;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export const reviewService = {
  // Lấy danh sách đánh giá
  getAllReviews: (page = 1, limit = 10, approvedOnly = false) => {
    return axiosInstance.get<Review[]>(`/reviews?page=${page}&limit=${limit}`, {
      params: { approved: approvedOnly }
    });
  },
  
  // Lấy chi tiết đánh giá
  getReviewById: (id: number) => {
    return axiosInstance.get<Review>(`/reviews/${id}`);
  },
  
  // Tạo mới đánh giá
  createReview: (data: Omit<Review, 'id' | 'created_at' | 'updated_at'>) => {
    return axiosInstance.post<Review>('/reviews', data);
  },
  
  // Cập nhật đánh giá
  updateReview: (id: number, data: Partial<Review>) => {
    return axiosInstance.put<Review>(`/reviews/${id}`, data);
  },
  
  // Xóa đánh giá
  deleteReview: (id: number) => {
    return axiosInstance.delete(`/reviews/${id}`);
  },
  
  // Duyệt/Phê duyệt đánh giá
  approveReview: (id: number) => {
    return axiosInstance.patch(`/reviews/${id}/approve`);
  },
  
  // Từ chối đánh giá
  rejectReview: (id: number, reason: string) => {
    return axiosInstance.patch(`/reviews/${id}/reject`, { reason });
  },
  
  // Lấy danh sách đánh giá theo dịch vụ
  getReviewsByService: (serviceId: number, page = 1, limit = 10) => {
    return axiosInstance.get<Review[]>(`/services/${serviceId}/reviews`, {
      params: { page, limit }
    });
  },
  
  // Lấy danh sách đánh giá theo người dùng
  getReviewsByUser: (userId: number, page = 1, limit = 10) => {
    return axiosInstance.get<Review[]>(`/users/${userId}/reviews`, {
      params: { page, limit }
    });
  }
};

export default reviewService;
