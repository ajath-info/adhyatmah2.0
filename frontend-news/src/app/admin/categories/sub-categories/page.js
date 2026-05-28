import React from 'react';

// components
import SubCategoryList from '@/components/_admin/categories/sub/category-list';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// apo
import * as api from 'src/services';

// Meta information
export const metadata = {
  title: 'Sub Categories - adhyatmah',
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
        heading="Sub Category"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Sub Categories'
          }
        ]}
        action={{
          href: `/admin/categories/sub-categories/add`,
          title: 'Add Sub Category'
        }}
      />
      <SubCategoryList categories={categories} />
    </>
  );
}
