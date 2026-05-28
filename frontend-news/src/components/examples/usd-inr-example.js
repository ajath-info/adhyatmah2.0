'use client';
import React from 'react';
// mui
import { Box, Typography, Stack, Paper, Divider } from '@mui/material';
// components
import CurrencyConverter from '@/components/currency-converter';
import DashboardCard from '@/components/cards/dashboard-card';
// icons
import { AiOutlineDollarCircle } from 'react-icons/ai';

export default function USDINRExample() {
  // Example data
  const exampleEarnings = [
    { title: 'Daily Earning', amount: 1250.50 },
    { title: 'Weekly Earning', amount: 8750.75 },
    { title: 'Monthly Earning', amount: 35000.25 },
    { title: 'Yearly Earning', amount: 420000.00 }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        USD to INR Conversion Examples
      </Typography>
      
      <Stack spacing={4}>
        {/* Currency Converter Component */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Interactive Currency Converter
          </Typography>
          <CurrencyConverter 
            initialAmount={100}
            initialFromCurrency="USD"
            showExchangeRate={true}
          />
        </Box>

        <Divider />

        {/* Compact Converter */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Compact Currency Converter
          </Typography>
          <CurrencyConverter 
            initialAmount={500}
            initialFromCurrency="USD"
            compact={true}
          />
        </Box>

        <Divider />

        {/* Dashboard Cards with Currency Conversion */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Dashboard Cards with USD to INR Conversion
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {exampleEarnings.map((earning, index) => (
              <Box key={index} sx={{ minWidth: 280 }}>
                <DashboardCard
                  color="primary"
                  isAmount
                  icon={<AiOutlineDollarCircle size={24} />}
                  title={earning.title}
                  value={earning.amount}
                  isLoading={false}
                  showCurrencyConversion={true}
                />
              </Box>
            ))}
          </Stack>
        </Box>

        <Divider />

        {/* Code Examples */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Usage Examples
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom>
              Basic Conversion:
            </Typography>
            <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
{`import { convertUSDToINR, formatIndianCurrency } from '@/utils/currency-converter';

const usdAmount = 100;
const inrAmount = convertUSDToINR(usdAmount);
console.log(formatIndianCurrency(inrAmount)); // ₹8,312.00`}
            </Typography>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
