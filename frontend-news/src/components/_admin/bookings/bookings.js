'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
// mui
import { Dialog, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// components
import Table from 'src/components/table/table';
import Booking from 'src/components/table/rows/booking';
// api
import * as api from 'src/services';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const TABLE_HEAD = [
  { id: 'customer', label: 'Customer' },
  { id: 'paymentAmount', label: 'Total' },
  { id: 'poojaType', label: 'Pooja Service' },
  { id: 'duration', label: 'Duration' },
  { id: 'status', label: 'Status' },
  { id: 'dateTime', label: 'Date' },
  { id: '', label: 'Actions' }
];

const STATUS_FILTER = {
  name: 'Status',
  param: 'status',
  data: [
    {
      name: 'Pending',
      slug: 'pending'
    },
    {
      name: 'Accepted',
      slug: 'accept'
    },
    {
      name: 'Ongoing',
      slug: 'ongoing'
    },
    {
      name: 'Upcoming',
      slug: 'upcoming'
    },
    {
      name: 'Completed',
      slug: 'completed'
    },
    {
      name: 'Cancelled',
      slug: 'cancelled'
    }
  ]
};

export default function VendorBookingsMain({ isVendor }) {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  const { data, isPending: isLoading, error } = useQuery({
    queryKey: ['vendor-booking-history', apicall, isVendor],
    queryFn: () => api.getBookingHistory()
  });

  // Transform data structure for Table component
  const transformedData = React.useMemo(() => {
    if (!data?.payload) return { data: [], total: 0, count: 0, currentPage: 1, totalPages: 0 };
    
    // Combine all bookings from different statuses
    const allBookings = [
      ...(data.payload.ongoing || []),
      ...(data.payload.upcoming || []),
      ...(data.payload.previous || [])
    ];
    
    return {
      data: allBookings,
      total: allBookings.length,
      count: 1,
      currentPage: 1,
      totalPages: 1
    };
  }, [data]);

  // Debug logging
  console.log('API Response:', data);
  console.log('Error:', error);
  console.log('Transformed Data:', transformedData);
  console.log('Is Loading:', isLoading);

  // Show error if API call fails
  if (error) {
    console.error('API Error Details:', error);
    toast.error(`API Error: ${error.message || 'Failed to fetch bookings'}`);
  }

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, status }) => api.updateBookingStatusByVendor({ id, status }),
    onSuccess: () => {
      toast.success('Booking status updated successfully!');
      setOpen(false);
      setApicall(prev => !prev);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  });

  const handleClickOpen = (bookingId) => () => {
    setSelectedBookingId(bookingId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBookingId(null);
    setSelectedStatus('');
  };

  const handleStatusUpdate = () => {
    if (selectedBookingId && selectedStatus) {
      updateStatus({ id: selectedBookingId, status: selectedStatus });
    }
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'sm'}>
        <div style={{ padding: '24px' }}>
          <h3>Update Booking Status</h3>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="accept">Accepted</MenuItem>
              <MenuItem value="ongoing">Ongoing</MenuItem>
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <button onClick={handleClose}>Cancel</button>
            <button 
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </button>
          </Stack>
        </div>
      </Dialog>
      
      <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        {}
      </Stack>
      <Table
        headData={TABLE_HEAD}
        data={transformedData}
        isLoading={isLoading}
        row={Booking}
        handleClickOpen={handleClickOpen}
        isVendor={isVendor}
        filters={[{ ...STATUS_FILTER }]}
        isSearch
      />
    </>
  );
}

VendorBookingsMain.propTypes = {
  isVendor: PropTypes.bool
};
