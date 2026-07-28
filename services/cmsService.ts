import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Resource, CreateResourceDto, UpdateResourceDto } from '@/types/cms.types';

export const cmsService = {
  getAll: async (params?: Record<string, string>): Promise<Resource[]> => {
    const res = await apiClient.get<Resource[]>(API_ENDPOINTS.CMS_RESOURCES, { params });
    return res.data;
  },

  getById: async (id: string): Promise<Resource> => {
    const res = await apiClient.get<Resource>(API_ENDPOINTS.CMS_RESOURCE_BY_ID(id));
    return res.data;
  },

  create: async (data: CreateResourceDto): Promise<Resource> => {
    const res = await apiClient.post<Resource>(API_ENDPOINTS.CMS_RESOURCES, data);
    return res.data;
  },

  update: async (id: string, data: UpdateResourceDto): Promise<Resource> => {
    const res = await apiClient.patch<Resource>(API_ENDPOINTS.CMS_RESOURCE_BY_ID(id), data);
    return res.data;
  },

  togglePublish: async (id: string): Promise<Resource> => {
    const res = await apiClient.patch<Resource>(API_ENDPOINTS.CMS_RESOURCE_PUBLISH(id));
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CMS_RESOURCE_BY_ID(id));
  },
};
