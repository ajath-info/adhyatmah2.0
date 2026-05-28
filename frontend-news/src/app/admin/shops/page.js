import React from 'react';

// components
import ShopsMain from '@/components/_admin/shops/shops';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// Meta information
export const metadata = {
  title: 'Products - adhyatmah',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah'
};

export default async function AdminProducts() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Pandits"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Pandits'
          }
        ]}
      />
      <ShopsMain />
    </div>
  );
}
