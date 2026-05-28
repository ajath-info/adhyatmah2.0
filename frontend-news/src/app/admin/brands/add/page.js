import React from 'react';

// components
import AddBrand from '@/components/_admin/brands/add-brand';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Brands"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Brands',
            href: '/admin/brands'
          },
          {
            name: 'Add brand'
          }
        ]}
      />
      <AddBrand />
    </div>
  );
}
