/**
 * Currency conversion utilities
 * Provides functions to convert between USD and INR
 */

// Current USD to INR exchange rate (you can update this or fetch from an API)
const USD_TO_INR_RATE = 83.12; // Approximate rate as of 2024

/**
 * Convert USD to INR
 * @param {number} usdAmount - Amount in USD
 * @param {number} rate - Exchange rate (optional, defaults to current rate)
 * @returns {number} - Amount in INR
 */
export const convertUSDToINR = (usdAmount, rate = USD_TO_INR_RATE) => {
  if (typeof usdAmount !== 'number' || isNaN(usdAmount)) {
    return 0;
  }
  return Number((usdAmount * rate).toFixed(2));
};

/**
 * Convert INR to USD
 * @param {number} inrAmount - Amount in INR
 * @param {number} rate - Exchange rate (optional, defaults to current rate)
 * @returns {number} - Amount in USD
 */
export const convertINRToUSD = (inrAmount, rate = USD_TO_INR_RATE) => {
  if (typeof inrAmount !== 'number' || isNaN(inrAmount)) {
    return 0;
  }
  return Number((inrAmount / rate).toFixed(2));
};

/**
 * Format currency with proper symbols and formatting
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code ('USD' or 'INR')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR', locale = 'en-US') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0';
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(amount);
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

/**
 * Get current exchange rate (can be extended to fetch from API)
 * @returns {number} - Current USD to INR exchange rate
 */
export const getCurrentExchangeRate = () => {
  return USD_TO_INR_RATE;
};

/**
 * Format amount with Indian number system (lakhs, crores)
 * @param {number} amount - Amount in INR
 * @returns {string} - Formatted string with Indian number system
 */
export const formatIndianCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }

  if (amount >= 10000000) {
    // Crores
    const crores = amount / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    // Lakhs
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(2)} L`;
  } else if (amount >= 1000) {
    // Thousands
    const thousands = amount / 1000;
    return `₹${thousands.toFixed(2)} K`;
  } else {
    return `₹${amount.toFixed(2)}`;
  }
};

/**
 * React hook for currency conversion
 * @param {string} fromCurrency - Source currency ('USD' or 'INR')
 * @param {string} toCurrency - Target currency ('USD' or 'INR')
 * @returns {function} - Conversion function
 */
export const useCurrencyConverter = (fromCurrency = 'INR', toCurrency = 'USD') => {
  const convert = (amount) => {
    if (fromCurrency === 'USD' && toCurrency === 'INR') {
      return convertUSDToINR(amount);
    } else if (fromCurrency === 'INR' && toCurrency === 'USD') {
      return convertINRToUSD(amount);
    }
    return amount; // Same currency, no conversion needed
  };

  return convert;
};
