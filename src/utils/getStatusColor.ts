const STATUS_STYLES: Record<
  string,
  { color: string; background: string }
> = {
  Resolved: {
    color: "#10b981", // Emerald
    background: "#ecfdf5",
  },
  Assigned: {
    color: "#f59e0b", // Amber
    background: "#fffbeb",
  },
  'In Progress': {
    color: "#06b6d4", // Cyan
    background: "#ecfeff",
  },
  Submitted: {
    color: "#3b82f6", // Blue
    background: "#eff6ff",
  },
  Acknowledged: {
    color: "#8b5cf6", // Violet
    background: "#f5f3ff",
  },
  Default: {
    color: "#6b7280", // Gray
    background: "#f9fafb",
  },
};

export const getStatusColor = (status: string) =>
  STATUS_STYLES[status]?.color || STATUS_STYLES.Default.color;

export const getStatusBackgroundColor = (status: string) =>
  STATUS_STYLES[status]?.background || STATUS_STYLES.Default.background;
