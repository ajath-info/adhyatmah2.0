'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// mui
import { Card, CardContent, Typography, Stack, Divider, TextField, Button } from '@mui/material';

// hook
import { useCurrencyConvert } from '@/hooks/use-currency';
import { useCurrencyFormat } from '@/hooks/use-currency-format';

// api
import * as api from 'src/services';
import { useMutation } from '@tanstack/react-query';
PaymentInfo.propTypes = { setCouponCode: PropTypes.func.isRequired, setTotal: PropTypes.func.isRequired };

function isExpired(expirationDate) {
  const currentDateTime = new Date();
  return currentDateTime >= new Date(expirationDate);
}

export default function PaymentInfo({ setCouponCode, setTotal }) {
  const { product } = useSelector((state) => state);
  const { total, shipping, subtotal } = product.checkout;
  const [code, setCode] = useState('');
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormat();

  const [discountPrice, setDiscountPrice] = useState(null);
  const [appliedDiscount, setDiscount] = useState(null);

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: api.applyCouponCode,
    onSuccess: ({ data }) => {
      if (isExpired(data.expire)) {
        toast.error('Coupon code is expired!');
        return;
      }

      const { type, discount } = data;
      setCouponCode(code);

      const calculateDiscount = () => {
        if (type === 'percent') {
          const discountAmount = (discount / 100) * subtotal;
          const discountedTotal = subtotal - discountAmount;
          setDiscount(discountAmount);
          return { total: discountedTotal + shipping, saved: discountAmount };
        } else {
          const discountedTotal = subtotal - discount;
          setDiscount(discount);
          return { total: discountedTotal + shipping, saved: discount };
        }
      };

      const { total, saved } = calculateDiscount();
      setTotal(total);
      setDiscountPrice(total);

      toast.success(`Coupon code applied. You saved ${fCurrency(cCurrency(saved))}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Coupon code is not valid');
    }
  });

  const onApplyCoupon = () => {
    if (code.length > 3) {
      mutate(code);
    } else {
      toast.error('Enter valid coupon code.');
    }
  };
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="h4" mb={1}>
          Payment Summary
        </Typography>

        <Stack spacing={0} mt={1} mb={2} gap={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Subtotal:
            </Typography>
            <Typography variant="subtitle2">{fCurrency(cCurrency(subtotal))}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Discount:
            </Typography>
            <Typography variant="subtitle2">-{fCurrency(cCurrency(appliedDiscount || 0))}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Shipping:
            </Typography>
            <Typography variant="subtitle2">{!shipping ? 'Free' : fCurrency(cCurrency(shipping))}</Typography>
          </Stack>

          <Stack direction={'row'} gap={1}>
            <TextField
              id="coupon-field"
              fullWidth
              placeholder="Enter coupon code"
              size="small"
              value={code}
              disabled={Boolean(discountPrice)}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              loading={isLoading}
              onClick={onApplyCoupon}
              variant="contained"
              color="primary"
              disabled={Boolean(discountPrice) || code.length < 4}
            >
              {discountPrice ? 'Applied' : 'Apply'}
            </Button>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mt={2}>
          <Typography variant="subtitle1">Total:</Typography>
          <Typography variant="subtitle1">{fCurrency(cCurrency(discountPrice || total))}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
