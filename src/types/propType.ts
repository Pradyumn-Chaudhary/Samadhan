export type NotificationCardProp = {
  image?: string | number;
  notificationText: string;
  timestamp: string;
  isRead: boolean;
};

export type ReportCardProp = {
  image?: string | number;
  context: string;
  timestamp: string;
  status: string;
};
