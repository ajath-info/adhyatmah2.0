'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Box, Tabs, Tab, Stack, Card, CardContent, Typography, Chip, Grid, Button, CircularProgress } from '@mui/material';
import * as api from 'src/services';

function BookingCard({ booking, onStatusUpdate }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const vendor = booking.vendor || {};
  const customer = booking.customer || {};

  const updateStatusMutation = useMutation({
    mutationFn: api.updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      if (onStatusUpdate) onStatusUpdate();
    },
    onError: (error) => {
      console.error('Failed to update booking status:', error);
      alert('Failed to update booking status. Please try again.');
    }
  });

  const handleStatusUpdate = (status) => {
    updateStatusMutation.mutate({ 
      bookingId: booking._id, 
      status 
    });
  };

  const handleViewDetails = () => {
    router.push(`/profile/bookings/${booking._id}`);
  };

  const getActionButton = () => {
    if (booking.status === 'pending') {
      return (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleStatusUpdate('accept')}
          disabled={updateStatusMutation.isPending}
          sx={{ minWidth: 80 }}
        >
          {updateStatusMutation.isPending ? <CircularProgress size={16} /> : 'Accept'}
        </Button>
      );
    } else if (booking.status === 'upcoming') {
      return (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleStatusUpdate('completed')}
          disabled={updateStatusMutation.isPending}
          sx={{ minWidth: 80 }}
        >
          {updateStatusMutation.isPending ? <CircularProgress size={16} /> : 'Complete'}
        </Button>
      );
    } else {
      return (
        <Button
          variant="outlined"
          size="small"
          onClick={handleViewDetails}
          sx={{ minWidth: 80 }}
        >
          View Details
        </Button>
      );
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
          <Stack direction="row" gap={2} alignItems="center">
            <div>
              <Typography fontWeight={600}>{booking.poojaType} — {booking.package}</Typography>
              <Typography variant="body2" color="text.secondary">Pandit: {vendor.firstName} {vendor.lastName}</Typography>
              <Typography variant="body2" color="text.secondary">Customer: {customer.firstName} {customer.lastName}</Typography>
              <Typography variant="body2" color="text.secondary">Address: {booking.address?.streetAddress}, {booking.address?.city}</Typography>
            </div>
          </Stack>
          <Stack gap={1} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
            <Chip size="small" color="primary" label={booking.bookingID} />
            <Typography variant="body2">{new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(booking.dateTime))}</Typography>
            <Typography variant="subtitle2">₹{booking.paymentAmount}</Typography>
            <Chip size="small" variant="outlined" label={booking.status} />
            {getActionButton()}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function BookingHistory() {
  const [tab, setTab] = React.useState('pending');

  const { data, isPending } = useQuery({
    queryKey: ['user-bookings'],
    queryFn: api.getUserBookings
  });

  const payload = data?.payload || { ongoing: [], pending: [], upcoming: [], previous: [] };

  const TAB_MAP = {
    pending: payload.pending || [],
    upcoming: payload.upcoming || [],
    previous: payload.previous || []
  };

  return (
    <Box mt={3}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }} allowScrollButtonsMobile variant="scrollable">
        <Tab value="pending" label={`Pending (${TAB_MAP.pending.length})`} />
        <Tab value="upcoming" label={`Upcoming (${TAB_MAP.upcoming.length})`} />
        <Tab value="previous" label={`Previous (${TAB_MAP.previous.length})`} />
      </Tabs>

      {isPending ? (
        <Typography>Loading bookings...</Typography>
      ) : (
        <Grid container spacing={2}>
          {(TAB_MAP[tab] || []).map((bk) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={bk._id}>
              <BookingCard booking={bk} />
            </Grid>
          ))}
          {TAB_MAP[tab].length === 0 && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography>No bookings in this list.</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}


