/**
 * Shared type definitions for the Campus Notifications frontend.
 */

/** Supported notification categories */
export type NotificationType = "Placement" | "Result" | "Event";

/** A single notification from the evaluation server */
export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

/** Response shape from the notifications API */
export interface NotificationsResponse {
  notifications: Notification[];
}

/** Query parameters for the notifications API */
export interface NotificationQueryParams {
  limit?: number;
  page?: number;
  notification_type?: NotificationType;
}

/** Priority weight mapping: Placement > Result > Event */
export const TYPE_WEIGHT: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/** Display colors for each notification type */
export const TYPE_COLORS: Record<NotificationType, string> = {
  Placement: "#4CAF50",
  Result: "#2196F3",
  Event: "#FF9800",
};

/** Icons for each notification type (Material UI icon names) */
export const TYPE_LABELS: Record<NotificationType, string> = {
  Placement: "💼",
  Result: "📊",
  Event: "🎉",
};
