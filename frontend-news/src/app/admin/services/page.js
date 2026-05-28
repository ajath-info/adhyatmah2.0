import React from 'react';

// components
import VendorServicesMain from '@/components/_admin/services/services';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// Meta information
export const metadata = {
  applicationName: 'Adhyatmah',
  authors: 'Adhyatmah'
};

export default async function AdminServices() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Pandit Services"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Pandit Services'
          }
        ]}
        action={{
          href: `/admin/services/add`,
          title: 'Add Pandit Service'
        }}
      />
      <VendorServicesMain isVendor={false} />
    </div>
  );
}

