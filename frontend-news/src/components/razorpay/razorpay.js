'use client';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

// mui
import { 
  Box, 
  Button, 
  Typography, 
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';

// icons
import { MdPayment } from 'react-icons/md';

RazorpayCheckout.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  orderData: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    keyId: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    customerEmail: PropTypes.string.isRequired,
    customerPhone: PropTypes.string,
    serviceName: PropTypes.string.isRequired
  }).isRequired,
  processing: PropTypes.bool,
  setProcessing: PropTypes.func
};

export default function RazorpayCheckout({ 
  onSuccess, 
  onError, 
  orderData, 
  processing = false,
  setProcessing = () => {}
}) {
  const [error, setError] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          setError('Failed to load Razorpay script');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      setError('Razorpay script not loaded');
      return;
    }

    if (!window.Razorpay) {
      setError('Razorpay not available');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Adhyatmah',
        description: `Payment for ${orderData.serviceName}`,
        order_id: orderData.orderId,
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone || ''
        },
        theme: {
          color: '#1C6BD2'
        },
        handler: function (response) {
          // Payment successful
          onSuccess({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          });
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            onError('Payment cancelled by user');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.message || 'Failed to initialize payment');
      setProcessing(false);
      onError(err.message || 'Failed to initialize payment');
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            fullWidth
          >
            Reload Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <MdPayment size={48} color="#1C6BD2" />
          <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
            Razorpay Payment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Secure payment powered by Razorpay
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Amount: ₹{orderData.amount / 100}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Service: {orderData.serviceName}
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handlePayment}
          disabled={processing || !razorpayLoaded}
          startIcon={processing ? <CircularProgress size={20} /> : <MdPayment />}
          sx={{ 
            backgroundColor: '#1C6BD2',
            '&:hover': {
              backgroundColor: '#1557A0'
            }
          }}
        >
          {processing ? 'Processing...' : 'Pay with Razorpay'}
        </Button>

        {!razorpayLoaded && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
            Loading Razorpay...
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
