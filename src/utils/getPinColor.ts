export const getPinColor = (category: string) => {
  switch (category) {
    case 'Road':
      return 'red';
    case 'Garbage':
      return 'orange';
    case 'Electricity':
      return 'blue';
    default:
      return 'green';
  }
};
