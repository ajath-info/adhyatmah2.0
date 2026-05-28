import PropTypes from 'prop-types';
// mui
import { alpha } from '@mui/material/styles';
import { Box, Card, Typography, Button, Skeleton, Stack, Chip } from '@mui/material';
import { useCurrencyFormat } from '@/hooks/use-currency-format';
import { convertUSDToINR, formatCurrency, formatIndianCurrency } from '@/utils/currency-converter';

DashboardCard.propTypes = {
  title: PropTypes.string.required,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool.isRequired,
  isAmount: PropTypes.bool,
  icon: PropTypes.any,
  color: PropTypes.string.isRequired,
  showCurrencyConversion: PropTypes.bool
};

export default function DashboardCard({ title, value, isLoading, isAmount, icon, color, showCurrencyConversion = false }) {
  const isHex = color.includes('#');
  const fCurrency = useCurrencyFormat('base');
  
  // Convert USD to INR if showCurrencyConversion is true and isAmount is true
  const inrValue = showCurrencyConversion && isAmount && value ? convertUSDToINR(Number(value)) : null;
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2
      }}
    >
      <>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{isLoading ? <Skeleton variant="text" width="100px" /> : title}</Typography>
          <Stack spacing={0.5}>
            <Typography variant="h3">
              {isLoading ? <Skeleton variant="text" width="100px" /> : isAmount ? fCurrency(value) : value}
            </Typography>
            {showCurrencyConversion && inrValue && !isLoading && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip 
                  label={formatIndianCurrency(inrValue)} 
                  size="small" 
                  color="secondary" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: '20px' }}
                />
                <Typography variant="caption" color="text.secondary">
                  (INR)
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>
        <Button
          sx={{
            display: 'block',
            minWidth: 54,
            lineHeight: 0,
            minHeight: 54,
            padding: 0,
            borderRadius: '50%',
            border: (theme) => `2px solid ${isHex ? color : theme.palette[color].main}!important`,
            color: (theme) => alpha(isHex ? color : theme.palette[color].main, 0.9) + '!important',
            background: 'transparent'
          }}
          variant="contained"
        >
          {icon}
        </Button>
      </>
    </Card>
  );
}
