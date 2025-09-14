export const getIcon = (category: string) => {
  switch (category) {
    case 'Road':
      return '🚧'; // Hole emoji for potholes
    case 'Garbage':
      return '🗑️'; // Wastebasket
    case 'Electricity':
      return '⚡️'; // High voltage sign
    default:
      return '📍'; // Round pushpin
  }
};