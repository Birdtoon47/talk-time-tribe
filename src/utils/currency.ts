
/**
 * Formats a number as currency with the specified currency code
 * @param amount The amount to format
 * @param currencyCode The currency code (defaults to IDR)
 * @returns A formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode: string = 'IDR'): string => {
  // Define conversion rates (simplified)
  const conversionRates: Record<string, number> = {
    'USD': 0.000064,
    'EUR': 0.000059,
    'GBP': 0.000050,
    'JPY': 0.0097,
    'SGD': 0.000086,
    'AUD': 0.000096,
    'IDR': 1
  };
  
  // Convert amount to selected currency
  const convertedAmount = amount * conversionRates[currencyCode];
  
  // Format based on currency
  return new Intl.NumberFormat(currencyCode === 'IDR' ? 'id-ID' : 'en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: currencyCode === 'JPY' || currencyCode === 'IDR' ? 0 : 2
  }).format(convertedAmount);
};
