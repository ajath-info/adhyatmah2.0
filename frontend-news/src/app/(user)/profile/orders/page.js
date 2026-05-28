import React from 'react';

// mui
import { Container } from '@mui/material';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import InvoiceHistory from '@/components/_main/profile/invoice-history';

// Meta information
export const metadata = {
  title: 'Invoice | adhyatmah- Your Order Details and Payment Confirmation',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah'
};

export default async function OrderPage() {
  return (
    <Container maxWidth="xl">
      <HeaderBreadcrumbs
        heading="Orders"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Profile',
            href: '/profile/orders'
          },
          {
            name: 'Orders'
          }
        ]}
      />
      <InvoiceHistory />
    </Container>
  );
}
