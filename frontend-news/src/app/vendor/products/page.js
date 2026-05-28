import React from 'react';

// components
import ProductList from '@/components/_admin/products/products';
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
        heading="Pandit Products"
        links={[
          {
            name: 'Dashboard',
            href: '/vendor/dashboard'
          },
          {
            name: 'Pandit Products'
          }
        ]}
        action={{
          href: `/vendor/products/add`,
          title: 'Add Pandit Product'
        }}
      />
      <ProductList isVendor />
    </div>
  );
}
