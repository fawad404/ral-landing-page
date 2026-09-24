import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

export interface ArizonaUpdate {
  _id: string;
  aiHeadline?: string;
  originalTitle: string;
  aiSummary?: string;
  aiWhatThisMeans?: string;
  aiWhoIsAffected?: string;
  aiOperatorTakeaway?: string;
  articleUrl: string;
  sourceName: string;
  category?: string;
  urgency?: 'immediate' | 'this_week' | 'monitor' | 'no_action';
  isArizonaSpecific?: boolean;
  originalPublishDate?: string;
  publishedAt?: string;
  createdAt?: string;
}

export interface ArizonaUpdatesPage {
  items: ArizonaUpdate[];
  total: number;
  page: number;
  limit: number;
}

export const arizonaUpdatesService = {
  list: async (page = 1): Promise<ArizonaUpdatesPage> => {
    const res = await apiClient.get<ArizonaUpdatesPage>(API_ENDPOINTS.ARIZONA_UPDATES, { params: { page, limit: 20 } });
    return res.data;
  },
};
