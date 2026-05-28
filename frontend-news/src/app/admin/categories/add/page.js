import React from 'react';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import AddCategory from '@/components/_admin/categories/parent/add-category';

// Meta information
export const metadata = {
  title: 'Add Categories - adhyatmah',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah'
};

export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Add Category"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Categories',
            href: '/admin/categories'
          },
          {
            name: 'Add Category'
          }
        ]}
      />
      <AddCategory />
    </div>
  );
}
