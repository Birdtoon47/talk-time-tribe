
/**
 * Formats a currency amount based on the provided currency code
 */
export const formatCurrency = (amount: number, currencyCode: string = 'IDR') => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: currencyCode,
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Gets the initials from a name (first letter of first name and first letter of last name)
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Formats a date object into a readable string format
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};
