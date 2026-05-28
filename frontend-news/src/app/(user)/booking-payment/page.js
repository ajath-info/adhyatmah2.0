'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { MdPayment, MdArrowBack } from 'react-icons/md';

export default function BookingPayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState('INR');

  const bookingId = searchParams.get('bookingId');

  const handlePayment = async () => {
    if (!bookingId) {
      setError('Booking ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Please log in to make payment');
        setLoading(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.adhyatmah.com';
      const response = await fetch(`${baseUrl}/api/createBookingPayment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookingId: bookingId,
          currency: currency
        })
      });

      const data = await response.json();

      if (data.error === false) {
        // Redirect to Stripe payment page
        window.location.href = data.payload.payment_url;
      } else {
        setError(data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      setError('Failed to create payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
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
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <MdPayment size={60} color="#1976d2" style={{ marginBottom: 16 }} />
            <Typography variant="h4" gutterBottom>
              Complete Your Payment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Secure payment powered by Stripe
            </Typography>
          </Box>

          {bookingId && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Booking ID: {bookingId}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Currency</InputLabel>
            <Select value={currency} label="Currency" onChange={(e) => setCurrency(e.target.value)}>
              <MenuItem value="INR">INR (Indian Rupee)</MenuItem>
              <MenuItem value="INR">INR (US Dollar)</MenuItem>
              <MenuItem value="EUR">EUR (Euro)</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePayment}
              disabled={loading || !bookingId}
              startIcon={loading ? <CircularProgress size={20} /> : <MdPayment />}
              sx={{ minWidth: 150 }}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
            <Button variant="outlined" onClick={handleGoBack} startIcon={<MdArrowBack />} sx={{ minWidth: 150 }}>
              Go Back
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            You will be redirected to a secure Stripe checkout page to complete your payment.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
