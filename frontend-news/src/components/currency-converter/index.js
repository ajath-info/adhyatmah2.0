'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// mui
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Chip, 
  Divider,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import { SwapHoriz, Info } from '@mui/icons-material';
// utils
import { 
  convertUSDToINR, 
  convertINRToUSD, 
  formatCurrency, 
  formatIndianCurrency,
  getCurrentExchangeRate 
} from '@/utils/currency-converter';

CurrencyConverter.propTypes = {
  initialAmount: PropTypes.number,
  initialFromCurrency: PropTypes.oneOf(['USD', 'INR']),
  showExchangeRate: PropTypes.bool,
  compact: PropTypes.bool
};

export default function CurrencyConverter({ 
  initialAmount = 100, 
  initialFromCurrency = 'INR',
  showExchangeRate = true,
  compact = false 
}) {
  const [amount, setAmount] = useState(initialAmount);
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState(initialFromCurrency === 'USD' ? 'INR' : 'USD');
  const [convertedAmount, setConvertedAmount] = useState(0);

  const exchangeRate = getCurrentExchangeRate();

  const handleAmountChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    setAmount(value);
    convertCurrency(value, fromCurrency);
  };

  const convertCurrency = (value, from) => {
    if (from === 'USD') {
      setConvertedAmount(convertUSDToINR(value));
    } else {
      setConvertedAmount(convertINRToUSD(value));
    }
  };

  const handleSwapCurrencies = () => {
    const newFromCurrency = toCurrency;
    const newToCurrency = fromCurrency;
    setFromCurrency(newFromCurrency);
    setToCurrency(newToCurrency);
    convertCurrency(amount, newFromCurrency);
  };

  const handleCurrencyChange = (currency) => {
    setFromCurrency(currency);
    setToCurrency(currency === 'USD' ? 'INR' : 'USD');
    convertCurrency(amount, currency);
  };

  React.useEffect(() => {
    convertCurrency(amount, fromCurrency);
  }, [amount, fromCurrency]);

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          size="small"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">{fromCurrency}</InputAdornment>,
          }}
          sx={{ width: 120 }}
        />
        <IconButton onClick={handleSwapCurrencies} size="small">
          <SwapHoriz />
        </IconButton>
        <Chip 
          label={fromCurrency === 'USD' ? formatIndianCurrency(convertedAmount) : formatCurrency(convertedAmount, 'USD')}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Currency Converter
        </Typography>
        
        {showExchangeRate && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                1 USD = ₹{exchangeRate}
              </Typography>
              <Tooltip title="Exchange rate is approximate and may vary">
                <Info fontSize="small" color="action" />
              </Tooltip>
            </Stack>
          </Box>
        )}

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">{fromCurrency}</InputAdornment>,
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleSwapCurrencies}
              startIcon={<SwapHoriz />}
              size="small"
            >
              Swap Currencies
            </Button>
          </Box>

          <Divider />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary" gutterBottom>
              {fromCurrency === 'USD' 
                ? formatIndianCurrency(convertedAmount)
                : formatCurrency(convertedAmount, 'USD')
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {toCurrency}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} justifyContent="center">
            <Chip
              label="USD"
              onClick={() => handleCurrencyChange('USD')}
              color={fromCurrency === 'USD' ? 'primary' : 'default'}
              variant={fromCurrency === 'USD' ? 'filled' : 'outlined'}
            />
            <Chip
              label="INR"
              onClick={() => handleCurrencyChange('INR')}
              color={fromCurrency === 'INR' ? 'primary' : 'default'}
              variant={fromCurrency === 'INR' ? 'filled' : 'outlined'}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
