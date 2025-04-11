
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
