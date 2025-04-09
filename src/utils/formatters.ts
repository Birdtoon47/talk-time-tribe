
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
