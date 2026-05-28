import React from 'react';

// Components
import BrandList from '@/components/_admin/brands/brand-list';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// Meta information
export const metadata = {
  title: 'Brands - adhyatmah',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah'
};

export default function Brands() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Brands"
        links={[
          {
            name: 'Admin Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Brands'
          }
        ]}
        action={{
          href: `/admin/brands/add`,
          title: 'Add brand'
        }}
      />
      <BrandList />
    </>
  );
}
