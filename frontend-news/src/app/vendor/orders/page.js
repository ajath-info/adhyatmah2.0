import React from 'react';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import VendorBookingsMain from '@/components/_admin/bookings/bookings';

// Meta information
export const metadata = {
  title: 'Booking Services - Adhyatmah',
  applicationName: 'Adhyatmah',
  authors: 'Adhyatmah'
};
export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Pandit Bookings"
        links={[
          {
            name: 'Dashboard',
            href: '/vendor/dashboard'
          },
          {
            name: 'Pandit Bookings'
          }
        ]}
      />
      <VendorBookingsMain isVendor />
    </div>
  );
}
