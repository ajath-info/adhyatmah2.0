import React from 'react';

// components
import VendorServicesMain from '@/components/_admin/services/services';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// Meta information
export const metadata = {
  applicationName: 'Adhyatmah',
  authors: 'Adhyatmah'
};

export default async function VendorServices() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Pandit Services"
        links={[
          {
            name: 'Dashboard',
            href: '/vendor/dashboard'
          },
          {
            name: 'Pandit Services'
          }
        ]}
        action={{
          href: `/vendor/services/add`,
          title: 'Add Pandit Service'
        }}
      />
      <VendorServicesMain isVendor />
    </div>
  );
}
