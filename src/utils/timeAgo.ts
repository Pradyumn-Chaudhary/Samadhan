export function timeAgo(timestamp: string) {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = (now.getTime() - past.getTime()) / 1000; // difference in seconds
  
    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day ago`;
    if (diff < 2592000) return `${Math.floor(diff / 604800)} week ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} month ago`;
    return `${Math.floor(diff / 31536000)} yr ago`;
  }
  