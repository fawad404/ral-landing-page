import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Notification } from '@/types/notification.types';

export const notificationService = {
  getAll: async (onlyUnread?: boolean): Promise<Notification[]> => {
    const res = await apiClient.get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS, {
      params: onlyUnread ? { onlyUnread: 'true' } : {},
    });
    return res.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await apiClient.get<number>(API_ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT);
    return res.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const res = await apiClient.patch<Notification>(API_ENDPOINTS.NOTIFICATION_READ(id));
    return res.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS_READ_ALL);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.NOTIFICATION_DELETE(id));
  },
};
