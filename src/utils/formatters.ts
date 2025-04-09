
/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currencyCode The ISO currency code (default: IDR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode: string = 'IDR'): string => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: currencyCode,
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Get initials from a name
 * @param name The full name
 * @returns Initials (up to 2 characters)
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  const parts = name.split(' ');
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
