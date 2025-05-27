import axiosInstance from '../utils/axiosConfig';

export const reviewService = {
  getAllReviews: (page = 1, limit = 10, approvedOnly = false) => {
    return axiosInstance.get('/reviews', {
      params: { page, limit, approvedOnly },
    });
  },
  
  getReviewById: (id: number) => {
    return axiosInstance.get(`/reviews/${id}`);
  },
  
  createReview: (reviewData: any) => {
    return axiosInstance.post('/reviews', reviewData);
  },
  
  updateReview: (id: number, reviewData: any) => {
    return axiosInstance.put(`/reviews/${id}`, reviewData);
  },
  
  deleteReview: (id: number) => {
    return axiosInstance.delete(`/reviews/${id}`);
  },
  
  toggleApproval: (id: number) => {
    return axiosInstance.patch(`/reviews/${id}/toggle-approval`);
  },
};

export default reviewService;
