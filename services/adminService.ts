import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

export interface AdminConfig {
  configKey: string;
  categoryLimits: Record<string, number>;
  defaultCategoryLimit: number;
  matchingWeights: { distance: number; services: number; budget: number };
  maxMatchResults: number;
}

export const adminService = {
  getConfig: async (): Promise<AdminConfig> => {
    const res = await apiClient.get<AdminConfig>(API_ENDPOINTS.ADMIN_CONFIG);
    return res.data;
  },

  updateConfig: async (data: Partial<AdminConfig>): Promise<AdminConfig> => {
    const res = await apiClient.patch<AdminConfig>(API_ENDPOINTS.ADMIN_CONFIG, data);
    return res.data;
  },
};
