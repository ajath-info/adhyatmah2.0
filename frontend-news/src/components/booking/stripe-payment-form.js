'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

// stripe
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

// mui
import { 
  Box, 
  Button, 
  Typography, 
  Alert,
  CircularProgress
} from '@mui/material';

// icons
import { MdPayment } from 'react-icons/md';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export default function StripePaymentForm({ 
  clientSecret, 
  amount, 
  onSuccess, 
  onError, 
  processing, 
  setProcessing 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe not loaded. Please refresh the page.');
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found. Please refresh the page.');
      setProcessing(false);
      return;
    }

    // Set a timeout to prevent infinite processing
    const timeout = setTimeout(() => {
      console.error('Payment timeout - taking too long');
      setError('Payment is taking too long. Please try again.');
      setProcessing(false);
    }, 30000); // 30 seconds timeout

    setTimeoutId(timeout);

    try {
      console.log('Confirming payment with client secret:', clientSecret);
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      // Clear timeout since payment completed
      clearTimeout(timeout);
      setTimeoutId(null);

      console.log('Payment result:', { stripeError, paymentIntent });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        setError(stripeError.message);
        setProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        onSuccess({ paymentIntent });
      } else {
        console.error('Payment failed or incomplete:', paymentIntent);
        setError('Payment failed. Please try again.');
        setProcessing(false);
      }
    } catch (err) {
      // Clear timeout on error
      clearTimeout(timeout);
      setTimeoutId(null);
      
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Card Information
        </Typography>
        
        <Box sx={{ 
          p: 2, 
          border: 1, 
          borderColor: 'divider', 
          borderRadius: 1,
          bgcolor: 'background.paper'
        }}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || processing}
        startIcon={processing ? <CircularProgress size={16} /> : <MdPayment />}
        sx={{ mt: 2 }}
      >
        {processing ? 'Processing Payment...' : `Pay ₹${amount} Advance`}
      </Button>
    </Box>
  );
}

StripePaymentForm.propTypes = {
  clientSecret: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  processing: PropTypes.bool.isRequired,
  setProcessing: PropTypes.func.isRequired
};
