'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, CardContent, Typography, Box, Alert } from '@mui/material';
import { MdCancel, MdArrowBack, MdHome, MdPayment } from 'react-icons/md';

export default function BookingPaymentCancel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleRetryPayment = () => {
    if (bookingId) {
      router.push(`/booking-payment?bookingId=${bookingId}`);
    } else {
      router.push('/profile/orders');
    }
  };

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
          <MdCancel size={80} color="orange" style={{ marginBottom: 16 }} />
          
          <Typography variant="h4" gutterBottom color="warning.main">
            Payment Cancelled
          </Typography>
          
          <Typography variant="h6" gutterBottom>
            Your payment was cancelled
          </Typography>

          <Alert severity="warning" sx={{ mb: 3 }}>
            No charges have been made to your account. Your booking is still pending payment.
          </Alert>

          {bookingId && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Booking ID: {bookingId}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You can retry the payment or contact support if you need assistance.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<MdPayment />}
              onClick={handleRetryPayment}
              sx={{ minWidth: 150 }}
            >
              Retry Payment
            </Button>
            <Button
              variant="outlined"
              startIcon={<MdArrowBack />}
              onClick={handleGoBack}
              sx={{ minWidth: 150 }}
            >
              Go Back
            </Button>
            <Button
              variant="outlined"
              startIcon={<MdHome />}
              onClick={handleGoHome}
              sx={{ minWidth: 150 }}
            >
              Go Home
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
