'use client';
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// razorpay
import RazorpayCheckout from './razorpay';

// mui
import { 
  Box, 
  Button, 
  Typography, 
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';

// icons
import { MdPayment, MdCheckCircle } from 'react-icons/md';

// api
import * as api from 'src/services';

export default function RazorpayPaymentForm({ 
  open,
  onClose,
  bookingData,
  onSuccess,
  onError
}) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Create Order', 'Payment', 'Confirmation'];

  const handleCreateOrder = useCallback(async () => {
    if (!bookingData) return;

    setProcessing(true);
    setError(null);
    setActiveStep(0);

    try {
      const response = await api.createRazorpayBookingPayment({
        bookingId: bookingData._id,
        currency: 'INR'
      });

      if (response.error === false) {
        setOrderData(response.payload);
        setActiveStep(1);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create payment order');
      onError(err?.response?.data?.message || 'Failed to create payment order');
    } finally {
      setProcessing(false);
    }
  }, [bookingData, onError]);

  const handlePaymentSuccess = useCallback(async (paymentResult) => {
    setProcessing(true);
    setError(null);

    try {
      const response = await api.verifyRazorpayBookingPayment({
        orderId: orderData.orderId,
        paymentId: paymentResult.razorpay_payment_id,
        signature: paymentResult.razorpay_signature,
        bookingId: bookingData._id
      });

      if (response.error === false) {
        setActiveStep(2);
        setTimeout(() => {
          onSuccess(response.payload.booking);
          handleClose();
        }, 2000);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Payment verification failed');
      onError(err?.response?.data?.message || 'Payment verification failed');
    } finally {
      setProcessing(false);
    }
  }, [orderData, bookingData, onSuccess, onError]);

  const handlePaymentError = useCallback((error) => {
    setError(error);
    onError(error);
  }, [onError]);

  const handleClose = () => {
    if (!processing) {
      setError(null);
      setOrderData(null);
      setActiveStep(0);
      onClose();
    }
  };

  const handleRetry = () => {
    setError(null);
    setOrderData(null);
    setActiveStep(0);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MdPayment color="#1C6BD2" />
          <Typography variant="h6">Razorpay Payment</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Ready to Pay?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Amount: ₹{bookingData?.paymentAmount || 0}
            </Typography>
            <Button
              variant="contained"
              onClick={handleCreateOrder}
              disabled={processing}
              startIcon={processing ? <CircularProgress size={20} /> : <MdPayment />}
              fullWidth
            >
              {processing ? 'Creating Order...' : 'Proceed to Payment'}
            </Button>
          </Box>
        )}

        {activeStep === 1 && orderData && (
          <RazorpayCheckout
            orderData={orderData}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            processing={processing}
            setProcessing={setProcessing}
          />
        )}

        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <MdCheckCircle size={64} color="#4CAF50" />
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Payment Successful!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your booking has been confirmed.
            </Typography>
            <CircularProgress sx={{ mt: 2 }} />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {activeStep < 2 && (
          <Button onClick={handleClose} disabled={processing}>
            Cancel
          </Button>
        )}
        {error && activeStep < 2 && (
          <Button onClick={handleRetry} disabled={processing}>
            Retry
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
