// utils/index.js
export const formatDate = (date) => {
  if (!date) return '';

  const [day, month, year] = date.split('/');
  const parsedDate = new Date(`${year}-${month}-${day}`);
  if (isNaN(parsedDate)) return '';

  return parsedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};
