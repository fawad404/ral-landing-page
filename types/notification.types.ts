export type NotificationType = 'new_inquiry' | 'facility_inactive' | 'user_signup' | 'general';

export interface Notification {
  _id: string;
  userId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
