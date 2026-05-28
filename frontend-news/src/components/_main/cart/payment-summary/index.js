'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
// mui
import { CardContent, Typography, Stack, Divider, Skeleton, Box, Button } from '@mui/material';

// hooks components
import { useCurrencyConvert } from '@/hooks/use-currency';
import { useCurrencyFormat } from '@/hooks/use-currency-format';
import RootStyled from './styled';
// images
import paymentImg from 'public/images/payment-method.png';

PaymentSummary.propTypes = { loading: PropTypes.bool.isRequired };

export default function PaymentSummary({ loading, cart }) {
  const { product } = useSelector((state) => state);
  const { total, shipping, subtotal } = product.checkout;

  const isEmptyCart = cart.length === 0;

  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormat();

  return (
    <RootStyled>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="h4" mb={1}>
          Payment Summary
        </Typography>
        <Stack spacing={0} mt={1} mb={2}>
          {/* Fixed: alignItem -> alignItems */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Subtotal:
            </Typography>
            <Typography variant="subtitle2">
              {loading ? <Skeleton variant="text" width={80} /> : fCurrency(cCurrency(subtotal))}
            </Typography>
          </Stack>
          {/* Fixed: alignItem -> alignItems */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Shipping:
            </Typography>
            <Typography variant="subtitle2">
              {loading ? (
                <Skeleton variant="text" width={80} />
              ) : !shipping ? (
                'Free'
              ) : (
                fCurrency(cCurrency(parseInt(shipping)))
              )}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        {/* Fixed: alignItem -> alignItems */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mt={2}>
          <Typography variant="subtitle1">Total:</Typography>
          <Typography variant="subtitle1">
            {loading ? <Skeleton variant="text" width={80} /> : fCurrency(cCurrency(total))}
          </Typography>
        </Stack>
        <Box sx={{ position: 'relative', width: '100%', height: 26, mt: 2 }}>
          <Image src={paymentImg} alt="payment" fill objectFit="contain" />
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{ borderRadius: '8px' }}
            disabled={isEmptyCart}
            loading={loading}
            component={Link}
            href="/checkout"
          >
            Checkout
          </Button>
        </Box>
      </CardContent>
    </RootStyled>
  );
}