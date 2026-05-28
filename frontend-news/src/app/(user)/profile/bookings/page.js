import React from 'react';

// mui
import { Container } from '@mui/material';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import BookingHistory from '@/components/_main/profile/booking-history';

export const metadata = {

  applicationName: 'adhyatmah',
  authors: 'adhyatmah'
};

export default function UserBookingsPage() {
  return (
    <Container maxWidth="xl">
      <HeaderBreadcrumbs
        heading="My Bookings"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Profile', href: '/profile/bookings' },
          { name: 'Bookings' }
        ]}
      />
      <BookingHistory />
    </Container>
  );
}


