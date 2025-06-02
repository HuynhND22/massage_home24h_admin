import axiosInstance from '../utils/axiosConfig';

interface Setting {
  key: string;
  value: any;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'json';
}

export const settingsService = {
  // Lấy tất cả cài đặt
  getAllSettings: (language?: string) => {
    return axiosInstance.get<Setting[]>(`/settings`, {
      params: { language }
    });
  },
  
  // Lấy cài đặt theo key
  getSettingByKey: (key: string, language?: string) => {
    return axiosInstance.get<Setting>(`/settings/${key}`, {
      params: { language }
    });
  },
  
  // Cập nhật cài đặt
  updateSetting: (key: string, data: Partial<Setting>) => {
    return axiosInstance.put<Setting>(`/settings/${key}`, data);
  },
  
  // Tạo mới cài đặt
  createSetting: (data: Omit<Setting, 'key'>) => {
    return axiosInstance.post<Setting>('/settings', data);
  },
  
  // Xóa cài đặt
  deleteSetting: (key: string) => {
    return axiosInstance.delete(`/settings/${key}`);
  },
  
  // Lấy danh sách cài đặt theo nhóm
  getSettingsByGroup: (group: string, language?: string) => {
    return axiosInstance.get<Setting[]>(`/settings/group/${group}`, {
      params: { language }
    });
  },
  
  // Cập nhật nhiều cài đặt cùng lúc
  updateMultipleSettings: (settings: Record<string, any>) => {
    return axiosInstance.post('/settings/batch', settings);
  }
};
