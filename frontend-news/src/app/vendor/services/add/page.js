import React from 'react';

// components
import ServiceForm from '@/components/forms/service';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// Meta information
export const metadata = {
  applicationName: 'Adhyatmah',
  authors: 'Adhyatmah'
};

export default async function AddService() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Add Pandit Service"
        links={[
          {
            name: 'Dashboard',
            href: '/vendor/dashboard'
          },
          {
            name: 'Pandit Services',
            href: '/vendor/services'
          },
          {
            name: 'Add Pandit Service'
          }
        ]}
      />
      <ServiceForm isVendor />
    </div>
  );
}
