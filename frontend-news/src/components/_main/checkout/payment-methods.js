'use client';
import React from 'react';
import PropTypes from 'prop-types';

// mui
import { Card, CardContent, FormControlLabel, Radio, Typography, Stack, RadioGroup, Collapse } from '@mui/material';
// icons
import { BsStripe } from 'react-icons/bs';
import { FaPaypal } from 'react-icons/fa';
import { IoCash } from 'react-icons/io5';
import { MdPayment } from 'react-icons/md';
// componenets
import StripeCheckoutForm from 'src/components/stripe/form';

PaymentMethodCard.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default function PaymentMethodCard({ value, setValue, error, isAnyDigital, isActiveStripe, isActivePaypal, isActiveRazorpay }) {
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" mb={1}>
          Payment Method
        </Typography>

        <Stack spacing={1} mt={1}>
          <RadioGroup value={value} onChange={handleChange} sx={{ pl: 1 }}>
            <FormControlLabel
              value="COD"
              disabled={isAnyDigital}
              control={<Radio />}
              label={
                <Stack direction="row" alignItems="center" spacing={1} ml={1}>
                  <IoCash size={20} />
                  <Typography variant="subtitle2">Cash On Delivery</Typography>
                </Stack>
              }
            />
	  
            {/*isActiveStripe && (
              <FormControlLabel
                value="stripe"
                control={<Radio />}
                label={
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    ml={1}
                    sx={{
                      svg: {
                        color: value === 'stripe' ? 'primary.main' : 'text.primary'
                      }
                    }}
                  >
                    <BsStripe size={20} />
                    <Typography variant="subtitle2">Stripe</Typography>
                  </Stack>
                }
              />
            )*/}

            {isActivePaypal && (
              <FormControlLabel
                value="paypal"
                control={<Radio />}
                label={
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    ml={1}
                    sx={{
                      svg: {
                        color: value === 'paypal' ? 'primary.main' : 'text.primary'
                      }
                    }}
                  >
                    <FaPaypal size={20} />
                    <Typography variant="subtitle2">PayPal</Typography>
                  </Stack>
                }
              />
            )}
            {isActiveRazorpay && (
              <FormControlLabel
                value="razorpay"
                control={<Radio />}
                label={
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    ml={1}
                    sx={{
                      svg: {
                        color: value === 'razorpay' ? 'primary.main' : 'text.primary'
                      }
                    }}
                  >
                    <MdPayment size={20} />
                    <Typography variant="subtitle2">Razorpay</Typography>
                  </Stack>
                }
              />
            )}
          </RadioGroup>
        </Stack>
        <Collapse in={value === 'stripe'}>
          <Typography variant="subtitle1" color="text.secondary" mt={1} mb={1}>
            Creadit Card
          </Typography>
          <StripeCheckoutForm error={error} />
        </Collapse>
      </CardContent>
    </Card>
  );
}
