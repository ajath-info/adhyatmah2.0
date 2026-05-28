'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from '@bprogress/next';
// mui
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Stack, 
  Typography, 
  Button, 
  Box,
  Chip,
  Skeleton,
  Grid,
  Divider
} from '@mui/material';
// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
// hooks
import { useCurrencyFormat } from '@/hooks/use-currency-format';
import { useSelector } from '@/redux';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'accept':
      return 'info';
    case 'ongoing':
      return 'primary';
    case 'upcoming':
      return 'secondary';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'accept':
      return 'Accepted';
    case 'ongoing':
      return 'Ongoing';
    case 'upcoming':
      return 'Upcoming';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export default function ViewBooking({ params }) {
  const router = useRouter();
  const { id } = params;
  const { currency } = useSelector((state) => state.settings);
  const fCurrency = useCurrencyFormat('base');
  
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['vendor-booking', id],
    queryFn: () => api.getBookingByVendor(id)
  });

  const booking = data?.data;

  if (isLoading) {
    return (
      <div>
        <HeaderBreadcrumbs
          admin
          heading="Pandit Booking Details"
          links={[
            { name: 'Dashboard', href: '/vendor/dashboard' },
            { name: 'Pandit Bookings', href: '/vendor/orders' },
            { name: 'Pandit Booking Details' }
          ]}
        />
        <Card>
          <CardHeader title={<Skeleton variant="text" width={200} />} />
          <CardContent>
            <Stack spacing={3}>
              <Skeleton variant="rectangular" height={56} />
              <Skeleton variant="rectangular" height={56} />
              <Skeleton variant="rectangular" height={56} />
              <Skeleton variant="rectangular" height={100} />
            </Stack>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Pandit Booking Details"
        links={[
          {
            name: 'Dashboard',
            href: '/vendor/dashboard'
          },
          {
            name: 'Pandit Bookings',
            href: '/vendor/orders'
          },
          {
            name: 'Pandit Booking Details'
          }
        ]}
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader 
              title={`Booking #${booking?.bookingID}`}
              subheader="Service Details"
            />
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Service Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                        Pooja Type:
                      </Typography>
                      <Typography variant="body1">
                        {booking?.poojaType}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                        Package:
                      </Typography>
                      <Typography variant="body1">
                        {booking?.package}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                        Duration:
                      </Typography>
                      <Typography variant="body1">
                        {booking?.duration}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                        Date & Time:
                      </Typography>
                      <Typography variant="body1">
                        {new Date(booking?.dateTime).toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                        Status:
                      </Typography>
                      <Chip 
                        label={getStatusLabel(booking?.status)} 
                        color={getStatusColor(booking?.status)} 
                        variant="filled"
                      />
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Customer Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                        Name:
                      </Typography>
                      <Typography variant="body1">
                        {booking?.customer?.firstName} {booking?.customer?.lastName}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                        Email:
                      </Typography>
                      <Typography variant="body1">
                        {booking?.customer?.email}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                        Phone:
                      </Typography>
                      <Typography variant="body1">
                        {booking?.customer?.phone || 'Not provided'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Service Address
                  </Typography>
                  <Typography variant="body1">
                    {booking?.address?.streetAddress}<br />
                    {booking?.address?.city}, {booking?.address?.state}<br />
                    {booking?.address?.country} {booking?.address?.zip}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="h6" gutterBottom>
                    Puja Samagri
                  </Typography>
                  <Typography variant="body1">
                    {booking?.pujaSamagri}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Payment Summary" />
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2">Service Amount:</Typography>
                  <Typography variant="h6" color="primary">
                    {fCurrency(booking?.paymentAmount, currency)}
                  </Typography>
                </Box>
                
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2">Booking ID:</Typography>
                  <Typography variant="body2">
                    {booking?.bookingID}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2">Created:</Typography>
                  <Typography variant="body2">
                    {new Date(booking?.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="outlined"
                  onClick={() => router.push('/vendor/orders')}
                >
                  Back to Pandit Bookings
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

ViewBooking.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};
