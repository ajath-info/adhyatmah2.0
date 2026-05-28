'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import * as api from 'src/services';

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const bookingId = params.id;

  const { data: bookingsData, isPending: bookingsLoading } = useQuery({
    queryKey: ['user-bookings'],
    queryFn: api.getUserBookings
  });

  const updateStatusMutation = useMutation({
    mutationFn: api.updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      alert('Booking status updated successfully!');
    },
    onError: (error) => {
      console.error('Failed to update booking status:', error);
      alert('Failed to update booking status. Please try again.');
    }
  });

  // Find the specific booking from all bookings
  const allBookings = [
    ...(bookingsData?.payload?.pending || []),
    ...(bookingsData?.payload?.upcoming || []),
    ...(bookingsData?.payload?.previous || []),
    ...(bookingsData?.payload?.ongoing || [])
  ];
  
  const booking = allBookings.find(bk => bk._id === bookingId);
  const vendor = booking?.vendor || {};
  const customer = booking?.customer || {};

  const handleStatusUpdate = (status) => {
    updateStatusMutation.mutate({ 
      bookingId: booking._id, 
      status 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'upcoming': return 'info';
      case 'ongoing': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getActionButton = () => {
    if (booking?.status === 'pending') {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleStatusUpdate('accept')}
          disabled={updateStatusMutation.isPending}
          sx={{ minWidth: 120 }}
        >
          {updateStatusMutation.isPending ? <CircularProgress size={20} /> : 'Accept Booking'}
        </Button>
      );
    } else if (booking?.status === 'upcoming') {
      return (
        <Button
          variant="contained"
          color="success"
          onClick={() => handleStatusUpdate('completed')}
          disabled={updateStatusMutation.isPending}
          sx={{ minWidth: 120 }}
        >
          {updateStatusMutation.isPending ? <CircularProgress size={20} /> : 'Complete Booking'}
        </Button>
      );
    }
    return null;
  };

  if (bookingsLoading) {
    return (
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Booking Details"
          links={[
            { name: 'Home', href: '/' },
            { name: 'Profile', href: '/profile/bookings' },
            { name: 'Booking Details' }
          ]}
        />
        <Alert severity="error" sx={{ mt: 3 }}>
          Booking not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <HeaderBreadcrumbs
        heading="Booking Details"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Profile', href: '/profile/bookings' },
          { name: 'Booking Details' }
        ]}
      />

      <Box mt={3}>
        <Grid container spacing={3}>
          {/* Main Booking Details */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
                  <Box>
                    <Typography variant="h4" gutterBottom>
                      {booking.poojaType} — {booking.package}
                    </Typography>
                    <Chip 
                      label={booking.status} 
                      color={getStatusColor(booking.status)}
                      sx={{ mb: 2 }}
                    />
                  </Box>
                  {getActionButton()}
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Booking Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Booking ID</Typography>
                        <Typography variant="body1" fontWeight={500}>{booking.bookingID}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {new Intl.DateTimeFormat(undefined, { 
                            day: '2-digit', 
                            month: 'long', 
                            year: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }).format(new Date(booking.dateTime))}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Duration</Typography>
                        <Typography variant="body1" fontWeight={500}>{booking.duration || 'Not specified'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Payment Amount</Typography>
                        <Typography variant="h6" color="primary">₹{booking.paymentAmount}</Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Service Details
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Pooja Type</Typography>
                        <Typography variant="body1" fontWeight={500}>{booking.poojaType}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Package</Typography>
                        <Typography variant="body1" fontWeight={500}>{booking.package}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Special Instructions</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {booking.specialInstructions || 'No special instructions'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar with Vendor and Customer Info */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={3}>
              {/* Vendor Information */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Pandit Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Name</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {vendor.firstName} {vendor.lastName}
                      </Typography>
                    </Box>
                    {vendor.phone && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1" fontWeight={500}>{vendor.phone}</Typography>
                      </Box>
                    )}
                    {vendor.email && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1" fontWeight={500}>{vendor.email}</Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Customer Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Name</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {customer.firstName} {customer.lastName}
                      </Typography>
                    </Box>
                    {customer.phone && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1" fontWeight={500}>{customer.phone}</Typography>
                      </Box>
                    )}
                    {customer.email && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1" fontWeight={500}>{customer.email}</Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Service Address
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Street Address</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {booking.address?.streetAddress || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">City</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {booking.address?.city || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">State</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {booking.address?.state || 'Not provided'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Pincode</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {booking.address?.pincode || 'Not provided'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
