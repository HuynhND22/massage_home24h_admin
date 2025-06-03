import axiosInstance from '../utils/axiosConfig';

export const uploadService = {
  uploadImage: async (formData: FormData) => {
    try {
      const response = await axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        data: {
          url: response.data.url
        }
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  deleteFile: async (fileUrl: string) => {
    try {
      const response = await axiosInstance.delete('/upload', {
        data: { fileUrl }
      });
      return response;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  },
};
