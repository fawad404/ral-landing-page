'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notificationService } from '@/services/notificationService';

export const NOTIF_KEYS = {
  all: ['notifications'] as const,
  count: ['notifications', 'count'] as const,
};

export function useNotifications(onlyUnread?: boolean) {
  return useQuery({ queryKey: [...NOTIF_KEYS.all, onlyUnread], queryFn: () => notificationService.getAll(onlyUnread), refetchInterval: 30000 });
}

export function useUnreadCount() {
  return useQuery({ queryKey: NOTIF_KEYS.count, queryFn: notificationService.getUnreadCount, refetchInterval: 30000 });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTIF_KEYS.all }),
    onError: () => toast.error('Failed to mark notification as read'),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIF_KEYS.all });
      qc.invalidateQueries({ queryKey: NOTIF_KEYS.count });
    },
    onError: () => toast.error('Failed to mark all notifications as read'),
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIF_KEYS.all });
      qc.invalidateQueries({ queryKey: NOTIF_KEYS.count });
    },
    onError: () => toast.error('Failed to delete notification'),
  });
}
