import React from 'react';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import EditProduct from '@/components/_admin/products/edit-product';

// api
import * as api from 'src/services';
export const revalidate = 1;
export default async function page(props) {
  const params = await props.params;
  const { data: categories } = await api.getAllCategories();
  const { data: brands } = await api.getAllBrandsByAdmin();

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Pandit Product"
        links={[
          {
            name: 'Dashboard',
            href: '/vendor/dashboard'
          },
          {
            name: 'Pandit Products',
            href: '/vendor/products'
          },
          {
            name: 'Edit Pandit Product'
          }
        ]}
      />
      <EditProduct brands={brands} categories={categories} slug={params.slug} isVendor />
    </div>
  );
}
