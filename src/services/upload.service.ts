import axiosInstance from '../utils/axiosConfig';

export const uploadService = {
  uploadImage: async (formData: FormData, preserveFilename: boolean = false) => {
    try {
      const response = await axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          folder: 'uploads',
          preserveFilename
        }
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
        data: { fileUrl } // Gửi fileUrl trong body theo yêu cầu của API
      });
      return response;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  },
};
