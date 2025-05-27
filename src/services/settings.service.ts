import axiosInstance from '../utils/axiosConfig';

export const settingsService = {
  getAllSettings: (language?: string) => {
    const params = language ? { language } : {};
    return axiosInstance.get('/settings', { params });
  },
  
  getSettingByKey: (key: string, language?: string) => {
    const params = language ? { language } : {};
    return axiosInstance.get(`/settings/${key}`, { params });
  },
  
  updateSetting: (key: string, settingData: any) => {
    return axiosInstance.put(`/settings/${key}`, settingData);
  },
  
  createSetting: (settingData: any) => {
    return axiosInstance.post('/settings', settingData);
  },
};
