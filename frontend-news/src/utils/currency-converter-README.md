# USD to INR Currency Converter

This utility provides comprehensive USD to INR currency conversion functionality for the application.

## Features

- ✅ Convert USD to INR and vice versa
- ✅ Format currencies with proper symbols and formatting
- ✅ Indian number system formatting (K, L, Cr)
- ✅ React hooks for easy integration
- ✅ Dashboard card integration with dual currency display
- ✅ Interactive currency converter component
- ✅ Comprehensive test coverage

## Quick Start

### Basic Usage

```javascript
import { convertUSDToINR, formatIndianCurrency } from '@/utils/currency-converter';

// Convert USD to INR
const usdAmount = 100;
const inrAmount = convertUSDToINR(usdAmount);
console.log(formatIndianCurrency(inrAmount)); // ₹8,312.00
```

### Dashboard Card Integration

```javascript
import DashboardCard from '@/components/cards/dashboard-card';
import { AiOutlineDollarCircle } from 'react-icons/ai';

<DashboardCard
  color="primary"
  isAmount
  icon={<AiOutlineDollarCircle size={24} />}
  title="Daily Earning"
  value={1250.50}
  isLoading={false}
  showCurrencyConversion={true} // Shows both USD and INR
/>
```

### Interactive Converter Component

```javascript
import CurrencyConverter from '@/components/currency-converter';

// Full converter
<CurrencyConverter 
  initialAmount={100}
  initialFromCurrency="USD"
  showExchangeRate={true}
/>

// Compact converter
<CurrencyConverter 
  initialAmount={500}
  compact={true}
/>
```

## API Reference

### Functions

#### `convertUSDToINR(usdAmount, rate?)`
Converts USD amount to INR.
- **usdAmount**: Number - Amount in USD
- **rate**: Number (optional) - Exchange rate (default: 83.12)
- **Returns**: Number - Amount in INR

#### `convertINRToUSD(inrAmount, rate?)`
Converts INR amount to USD.
- **inrAmount**: Number - Amount in INR
- **rate**: Number (optional) - Exchange rate (default: 83.12)
- **Returns**: Number - Amount in USD

#### `formatCurrency(amount, currency, locale?)`
Formats amount with proper currency symbols.
- **amount**: Number - Amount to format
- **currency**: String - Currency code ('USD' or 'INR')
- **locale**: String (optional) - Locale for formatting (default: 'en-US')
- **Returns**: String - Formatted currency string

#### `formatIndianCurrency(amount)`
Formats INR amount with Indian number system.
- **amount**: Number - Amount in INR
- **Returns**: String - Formatted string (e.g., "₹1.50 L", "₹2.50 Cr")

#### `getCurrentExchangeRate()`
Returns the current USD to INR exchange rate.
- **Returns**: Number - Current exchange rate

### React Hook

#### `useCurrencyConverter(fromCurrency, toCurrency)`
React hook for currency conversion.
- **fromCurrency**: String - Source currency ('USD' or 'INR')
- **toCurrency**: String - Target currency ('USD' or 'INR')
- **Returns**: Function - Conversion function

```javascript
import { useCurrencyConverter } from '@/utils/currency-converter';

const convert = useCurrencyConverter('USD', 'INR');
const inrAmount = convert(100); // 8312
```

## Components

### CurrencyConverter
Interactive currency converter component with multiple display modes.

**Props:**
- `initialAmount`: Number (default: 100) - Initial amount
- `initialFromCurrency`: String (default: 'USD') - Initial source currency
- `showExchangeRate`: Boolean (default: true) - Show exchange rate info
- `compact`: Boolean (default: false) - Compact display mode

### DashboardCard (Enhanced)
Enhanced dashboard card with currency conversion support.

**New Props:**
- `showCurrencyConversion`: Boolean (default: false) - Show INR conversion

## Exchange Rate

The current exchange rate is set to **83.12** (approximate rate as of 2024). You can:

1. Update the rate in `currency-converter.js`
2. Fetch real-time rates from an API
3. Pass custom rates to conversion functions

## Testing

Run the test suite:
```bash
npm test currency-converter.test.js
```

Or test manually in browser console:
```javascript
import { testCurrencyConversion } from '@/utils/__tests__/currency-converter.test.js';
testCurrencyConversion();
```

## Examples

See `/components/examples/usd-inr-example.js` for comprehensive usage examples including:
- Interactive converter
- Dashboard cards with conversion
- Code examples
- Different formatting options

## Integration with Existing Code

The converter integrates seamlessly with existing currency hooks:

```javascript
import { useCurrencyFormat } from '@/hooks/use-currency-format';
import { convertUSDToINR, formatIndianCurrency } from '@/utils/currency-converter';

const fCurrency = useCurrencyFormat('base');
const usdAmount = 100;
const inrAmount = convertUSDToINR(usdAmount);

// Display both currencies
console.log(fCurrency(usdAmount)); // $100.00
console.log(formatIndianCurrency(inrAmount)); // ₹8,312.00
```
