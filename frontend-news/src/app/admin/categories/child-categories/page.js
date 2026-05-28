import React from 'react';

// components
import ChildCategoryList from '@/components/_admin/categories/child/category-list';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// apo
import * as api from 'src/services';

// Meta information
export const metadata = {
  title: 'Child Categories - adhyatmah',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah'
};

export const dynamic = 'force-dynamic';
export default async function Categories() {
  const { data: categories } = await api.getAllCategoriesByAdmin();
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Child Categories"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Child Categories'
          }
        ]}
        action={{
          href: `/admin/categories/child-categories/add`,
          title: 'Add Child Category'
        }}
      />
      <ChildCategoryList categories={categories} />
    </>
  );
}
