'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
  Skeleton,
  Grid
} from '@mui/material';
import { IoCheckmarkCircle, IoArrowBack } from 'react-icons/io5';

export default function BookingSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bookingId = params.get('bookingId');

  useEffect(() => {
    if (!bookingId) {
      setError('Booking ID not found');
      setLoading(false);
      return;
    }

    async function fetchBooking() {
      try {
        setLoading(true);

        const backendBase = process.env.NEXT_PUBLIC_API_URL || window.location.origin;

        const resp = await fetch(`${backendBase}/api/booking?bookingId=${bookingId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!resp.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const data = await resp.json();

        // FIX: Match your API response
        if (data.success) {
          setBooking(data.payload.booking);
        } else {
          setError(data.message || 'Could not fetch booking');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [bookingId]);

  const handleContinueBrowsing = () => router.push('/');
  const handleViewBooking = () => router.push(`/profile/bookings`);

  // ----------------------------------------------
  // ERROR STATE
  // ----------------------------------------------
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>
          Booking Error
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {error}
        </Typography>
        <Button variant="contained" startIcon={<IoArrowBack />} onClick={handleContinueBrowsing}>
          Back to Home
        </Button>
      </Container>
    );
  }

  // ----------------------------------------------
  // LOADING STATE
  // ----------------------------------------------
  if (loading || !booking) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="rectangular" height={200} />
        </Stack>
      </Container>
    );
  }

  const customer = booking.customer || {}; // Safer shorthand
  const vendor = booking.vendor || {};

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* SUCCESS HEADER */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <IoCheckmarkCircle size={80} color="#4caf50" />
        <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold', color: '#4caf50' }}>
          Booking Successful!
        </Typography>
        <Typography variant="body1">Thank you for your booking. Your puja has been confirmed.</Typography>
      </Box>

      {/* BOOKING DETAILS */}
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Booking Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="caption">Booking Number</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {booking.bookingID || '#' + booking._id?.slice(-8)}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="caption">Booking Date</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {booking.createdAt ? new Date(booking.createdAt).toLocaleString('en-US') : 'N/A'}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="caption">Pooja Type</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {booking.poojaType || 'N/A'}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="caption">Package</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {booking.package || 'N/A'}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="caption">Date & Time</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {booking.dateTime ? new Date(booking.dateTime).toLocaleString('en-US') : 'N/A'}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="caption">Duration</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {booking.duration || 'N/A'}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="caption">Booking Status</Typography>
                <Chip
                  label={booking.status}
                  color={
                    booking.status === 'completed'
                      ? 'success'
                      : booking.status === 'upcoming'
                        ? 'info'
                        : booking.status === 'ongoing'
                          ? 'warning'
                          : booking.status === 'pending'
                            ? 'default'
                            : 'error'
                  }
                />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="caption">Payment Amount</Typography>
                <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  ₹{booking.paymentAmount?.toFixed(2) || '0.00'}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* PANDIT INFORMATION */}
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Pandit Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Name</Typography>
              <Typography>
                {vendor.firstName} {vendor.lastName}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Email</Typography>
              <Typography>{vendor.email}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Phone</Typography>
              <Typography>{vendor.phone}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Languages</Typography>
              <Typography>{booking.language?.join(', ') || 'Not specified'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* CUSTOMER INFORMATION */}
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Customer Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Name</Typography>
              <Typography>
                {customer.firstName} {customer.lastName}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Email</Typography>
              <Typography>{customer.email}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Phone</Typography>
              <Typography>{customer.phone}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ADDRESS INFORMATION */}
      {booking.address && (
        <Card sx={{ mb: 4, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Puja Address
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="caption">Full Address</Typography>
                <Typography>
                  {booking.address.streetAddress}, {booking.address.city}, {booking.address.state},{' '}
                  {booking.address.country} - {booking.address.zip}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* POOJA SAMAGRI */}
      {booking.pujaSamagri && (
        <Card sx={{ mb: 4, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Pooja Samagri Included
            </Typography>
            <Typography variant="body2">{booking.pujaSamagri}</Typography>
          </CardContent>
        </Card>
      )}

      {/* BUTTONS */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
        <Button variant="contained" size="large" onClick={handleViewBooking}>
          View My Bookings
        </Button>
        <Button variant="outlined" size="large" onClick={handleContinueBrowsing} startIcon={<IoArrowBack />}>
          Continue Browsing
        </Button>
      </Stack>
    </Container>
  );
}
