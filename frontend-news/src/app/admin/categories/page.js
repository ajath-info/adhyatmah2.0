import React from 'react';

// Components
import CategoryList from '@/components/_admin/categories/parent/category-list';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// Meta information
export const metadata = {
  title: 'Categories - adhyatmah',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah'
};

export default function Categories() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Categories"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Categories'
          }
        ]}
        action={{
          href: `/admin/categories/add`,
          title: 'Add Category'
        }}
      />
      <CategoryList />
    </>
  );
}
