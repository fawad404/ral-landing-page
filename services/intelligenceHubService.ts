import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type {
  ContentItem,
  ContentItemFilters,
  ContentItemsResponse,
  IHSource,
  IHStats,
  IngestResult,
} from '@/types/intelligence-hub.types';

export const intelligenceHubService = {
  // Stats & categories
  getStats: async (): Promise<IHStats> => {
    const res = await apiClient.get<IHStats>(API_ENDPOINTS.IH_STATS);
    return res.data;
  },

  getCategories: async (): Promise<string[]> => {
    const res = await apiClient.get<string[]>(API_ENDPOINTS.IH_CATEGORIES);
    return res.data;
  },

  // Ingest — long-running operation: override timeout to 5 minutes
  triggerIngest: async (): Promise<IngestResult> => {
    const res = await apiClient.post<IngestResult>(API_ENDPOINTS.IH_INGEST, undefined, {
      timeout: 300000,
    });
    return res.data;
  },

  // Sources
  getSources: async (): Promise<IHSource[]> => {
    const res = await apiClient.get<IHSource[]>(API_ENDPOINTS.IH_SOURCES);
    return res.data;
  },

  createSource: async (data: Partial<IHSource>): Promise<IHSource> => {
    const res = await apiClient.post<IHSource>(API_ENDPOINTS.IH_SOURCES, data);
    return res.data;
  },

  updateSource: async (id: string, data: Partial<IHSource>): Promise<IHSource> => {
    const res = await apiClient.patch<IHSource>(API_ENDPOINTS.IH_SOURCE_BY_ID(id), data);
    return res.data;
  },

  deleteSource: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.IH_SOURCE_BY_ID(id));
  },

  // Content items
  getItems: async (filters: ContentItemFilters = {}): Promise<ContentItemsResponse> => {
    const params: Record<string, any> = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.sourceName) params.sourceName = filters.sourceName;
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.approved !== '' && filters.approved !== undefined) params.approved = String(filters.approved);
    if (filters.reviewed !== '' && filters.reviewed !== undefined) params.reviewed = String(filters.reviewed);
    if (filters.readyToPost !== '' && filters.readyToPost !== undefined) params.readyToPost = String(filters.readyToPost);
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    const res = await apiClient.get<ContentItemsResponse>(API_ENDPOINTS.IH_ITEMS, { params });
    return res.data;
  },

  getItemById: async (id: string): Promise<ContentItem> => {
    const res = await apiClient.get<ContentItem>(API_ENDPOINTS.IH_ITEM_BY_ID(id));
    return res.data;
  },

  updateItem: async (id: string, data: Partial<ContentItem>): Promise<ContentItem> => {
    const res = await apiClient.patch<ContentItem>(API_ENDPOINTS.IH_ITEM_BY_ID(id), data);
    return res.data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.IH_ITEM_BY_ID(id));
  },

  reprocessItem: async (id: string): Promise<ContentItem> => {
    const res = await apiClient.post<ContentItem>(API_ENDPOINTS.IH_ITEM_REPROCESS(id));
    return res.data;
  },
};
