import { NotificationData, notifications } from '@mantine/notifications';

// ==================== NOTIFICATION DEFAULTS ====================
const NOTIFICATION_CONFIG = {
  position: 'top-center' as const,
  autoClose: 5000,
  withCloseButton: true,
  withBorder: true,
};

// ==================== NOTIFICATION TYPES ====================
type TNotificationOptions = Omit<NotificationData, 'message'> & {
  message: string;
  title?: string;
};

// ==================== SUCCESS NOTIFICATION ====================
export const notifySuccess = (options: TNotificationOptions) => {
  notifications.show({
    ...NOTIFICATION_CONFIG,
    color: 'green',
    ...options,
  });
};

// ==================== ERROR NOTIFICATION ====================
export const notifyError = (options: TNotificationOptions) => {
  notifications.show({
    ...NOTIFICATION_CONFIG,
    color: 'red',
    autoClose: 7000, // Error messages stay longer
    ...options,
  });
};

// ==================== INFO NOTIFICATION ====================
export const notifyInfo = (options: TNotificationOptions) => {
  notifications.show({
    ...NOTIFICATION_CONFIG,
    color: 'blue',
    ...options,
  });
};

// ==================== WARNING NOTIFICATION ====================
export const notifyWarning = (options: TNotificationOptions) => {
  notifications.show({
    ...NOTIFICATION_CONFIG,
    color: 'yellow',
    ...options,
  });
};

// ==================== LOADING NOTIFICATION ====================
export const notifyLoading = (id: string, message: string, title?: string) => {
  notifications.show({
    id,
    loading: true,
    title: title || 'Loading',
    message,
    autoClose: false,
    withCloseButton: false,
  });
};
