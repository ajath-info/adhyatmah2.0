/**
 * Test file for currency converter utilities
 * Run with: npm test currency-converter.test.js
 */

import { 
  convertUSDToINR, 
  convertINRToUSD, 
  formatCurrency, 
  formatIndianCurrency,
  getCurrentExchangeRate 
} from '../currency-converter';

describe('Currency Converter Utilities', () => {
  describe('convertUSDToINR', () => {
    test('should convert USD to INR correctly', () => {
      const usdAmount = 100;
      const result = convertUSDToINR(usdAmount);
      expect(result).toBe(8312.00); // 100 * 83.12
    });

    test('should handle zero amount', () => {
      const result = convertUSDToINR(0);
      expect(result).toBe(0);
    });

    test('should handle invalid input', () => {
      const result = convertUSDToINR('invalid');
      expect(result).toBe(0);
    });

    test('should handle custom exchange rate', () => {
      const usdAmount = 100;
      const customRate = 85.0;
      const result = convertUSDToINR(usdAmount, customRate);
      expect(result).toBe(8500.00);
    });
  });

  describe('convertINRToUSD', () => {
    test('should convert INR to USD correctly', () => {
      const inrAmount = 8312;
      const result = convertINRToUSD(inrAmount);
      expect(result).toBe(100.00); // 8312 / 83.12
    });

    test('should handle zero amount', () => {
      const result = convertINRToUSD(0);
      expect(result).toBe(0);
    });

    test('should handle invalid input', () => {
      const result = convertINRToUSD('invalid');
      expect(result).toBe(0);
    });
  });

  describe('formatCurrency', () => {
    test('should format USD currency correctly', () => {
      const amount = 100.50;
      const result = formatCurrency(amount, 'USD');
      expect(result).toContain('$');
      expect(result).toContain('100.50');
    });

    test('should format INR currency correctly', () => {
      const amount = 1000.50;
      const result = formatCurrency(amount, 'INR');
      expect(result).toContain('₹');
      expect(result).toContain('1,000.50');
    });

    test('should handle invalid amount', () => {
      const result = formatCurrency('invalid', 'USD');
      expect(result).toBe('0');
    });
  });

  describe('formatIndianCurrency', () => {
    test('should format amounts in thousands', () => {
      const amount = 5000;
      const result = formatIndianCurrency(amount);
      expect(result).toBe('₹5.00 K');
    });

    test('should format amounts in lakhs', () => {
      const amount = 150000;
      const result = formatIndianCurrency(amount);
      expect(result).toBe('₹1.50 L');
    });

    test('should format amounts in crores', () => {
      const amount = 15000000;
      const result = formatIndianCurrency(amount);
      expect(result).toBe('₹1.50 Cr');
    });

    test('should format small amounts', () => {
      const amount = 500;
      const result = formatIndianCurrency(amount);
      expect(result).toBe('₹500.00');
    });
  });

  describe('getCurrentExchangeRate', () => {
    test('should return current exchange rate', () => {
      const rate = getCurrentExchangeRate();
      expect(typeof rate).toBe('number');
      expect(rate).toBeGreaterThan(0);
    });
  });
});

// Manual test function for browser console
export const testCurrencyConversion = () => {
  console.log('=== Currency Conversion Tests ===');
  
  // Test USD to INR conversion
  const usdAmount = 100;
  const inrAmount = convertUSDToINR(usdAmount);
  console.log(`${usdAmount} USD = ${formatIndianCurrency(inrAmount)}`);
  
  // Test INR to USD conversion
  const inrAmount2 = 8312;
  const usdAmount2 = convertINRToUSD(inrAmount2);
  console.log(`${formatIndianCurrency(inrAmount2)} = ${formatCurrency(usdAmount2, 'USD')}`);
  
  // Test different amounts
  const testAmounts = [1, 10, 100, 1000, 10000];
  console.log('\nUSD to INR Conversion Table:');
  testAmounts.forEach(amount => {
    const converted = convertUSDToINR(amount);
    console.log(`$${amount} = ${formatIndianCurrency(converted)}`);
  });
  
  console.log('\nExchange Rate:', getCurrentExchangeRate());
};
