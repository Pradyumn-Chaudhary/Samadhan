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

export type ReportType = {
  report_id: string;
  photo_url: string;
  description: string;
  status: string;
  reported_at: string;
};

export type UserType = {
  user_id: string | null;
  full_name: string | null;
  email: string | null;
  region: object | null;
};

export type LocationType = {
  latitude: number;
  longitude: number;
};

export type IssueType = {
  issue_id: string,
  latitude?: number;
  longitude?: number;
  category: string;
  priority: number;
};