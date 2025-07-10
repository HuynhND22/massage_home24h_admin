import axiosInstance from '../utils/axiosConfig';

interface UploadResponse {
  url: string;
}

export const uploadService = {
  uploadImage: async (formData: FormData): Promise<UploadResponse> => {
    try {
      const response = await axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
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
      return response.data;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  },
};
