'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { MdCheckCircle, MdError, MdArrowBack, MdHome } from 'react-icons/md';

export default function BookingPaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('verifying');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  const paymentIntentId = searchParams.get('payment_intent');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    if (paymentIntentId && bookingId) {
      verifyPayment();
    } else {
      setError('Missing payment or booking information');
      setPaymentStatus('error');
    }
  }, [paymentIntentId, bookingId]);

  const verifyPayment = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Please log in to verify payment');
        setPaymentStatus('error');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.adhyatmah.com';
      const response = await fetch(`${baseUrl}/api/verifyBookingPayment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
          booking_id: bookingId
        })
      });

      const data = await response.json();

      if (data.error === false) {
        setPaymentData(data.payload);
        setPaymentStatus('success');
      } else {
        setError(data.message || 'Payment verification failed');
        setPaymentStatus('error');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setError('Failed to verify payment. Please try again.');
      setPaymentStatus('error');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleViewBooking = () => {
    router.push('/profile/orders');
  };

  if (paymentStatus === 'verifying') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 2,
          backgroundColor: '#f5f5f5'
        }}
      >
        <Card sx={{ maxWidth: 500, width: '100%' }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Verifying Payment...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we verify your payment.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 2,
          backgroundColor: '#f5f5f5'
        }}
      >
        <Card sx={{ maxWidth: 500, width: '100%' }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <MdError size={60} color="error" style={{ marginBottom: 16 }} />
            <Typography variant="h5" gutterBottom color="error">
              Payment Verification Failed
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" startIcon={<MdArrowBack />} onClick={handleGoBack}>
                Go Back
              </Button>
              <Button variant="contained" startIcon={<MdHome />} onClick={handleGoHome}>
                Go Home
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 2,
        backgroundColor: '#f5f5f5'
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <MdCheckCircle size={80} color="green" style={{ marginBottom: 16 }} />

          <Typography variant="h4" gutterBottom color="success.main">
            Payment Successful!
          </Typography>

          <Typography variant="h6" gutterBottom>
            Your booking payment has been confirmed
          </Typography>

          {paymentData && (
            <Box sx={{ mt: 3, textAlign: 'left' }}>
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Booking Details:
                </Typography>
                <Typography variant="body2">
                  <strong>Booking ID:</strong> {paymentData.booking.bookingID}
                </Typography>
                <Typography variant="body2">
                  <strong>Service:</strong> {paymentData.booking.poojaType} - {paymentData.booking.package}
                </Typography>
                <Typography variant="body2">
                  <strong>Date & Time:</strong> {new Date(paymentData.booking.dateTime).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {paymentData.booking.duration}
                </Typography>
                <Typography variant="body2">
                  <strong>Pandit:</strong> {paymentData.booking.vendor.firstName} {paymentData.booking.vendor.lastName}
                </Typography>
                <Typography variant="body2">
                  <strong>Amount Paid:</strong> ₹{paymentData.booking.paymentAmount}
                </Typography>
              </Card>

              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Payment Details:
                </Typography>
                <Typography variant="body2">
                  <strong>Payment ID:</strong> {paymentData.payment_details.payment_intent_id}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {paymentData.payment_status}
                </Typography>
                <Typography variant="body2">
                  <strong>Amount:</strong> ₹{paymentData.payment_details.amount}
                </Typography>
                <Typography variant="body2">
                  <strong>Currency:</strong> {paymentData.payment_details.currency}
                </Typography>
              </Card>
            </Box>
          )}

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" color="primary" onClick={handleViewBooking} sx={{ minWidth: 150 }}>
              View My Bookings
            </Button>
            <Button variant="outlined" onClick={handleGoHome} sx={{ minWidth: 150 }}>
              Go Home
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            You will receive a confirmation email shortly with all the details.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
