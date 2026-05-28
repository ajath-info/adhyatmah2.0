import React from 'react';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import AddChildCategory from '@/components/_admin/categories/child/add-category';

// api
import * as api from 'src/services';
export const dynamic = 'force-dynamic';
export default async function page() {
  const data = await api.getAllCategories();
  if (!data) {
    notFound();
  }
  const { data: categories } = data;
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Add Child Category"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Child Categories',
            href: '/admin/categories/child-categories'
          },
          {
            name: 'Add Child Category'
          }
        ]}
      />
      <AddChildCategory categories={categories} />
    </div>
  );
}
