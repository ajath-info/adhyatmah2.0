import React from 'react';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import PayoutsMain from 'src/components/_admin/payouts';

// api
import * as api from 'src/services';

// Meta information
export const metadata = {
  title: 'Payouts - adhyatmah',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah'
};
export default async function page() {
  const { data: shops } = await api.getAllShopsByAdmin();
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Payouts"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Payouts'
          }
        ]}
      />
      <PayoutsMain shops={shops} />
    </div>
  );
}
