import React from 'react';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import AddProduct from '@/components/_admin/products/add-product';

// api
import * as api from 'src/services';
export const dynamic = 'force-dynamic';

export default async function page() {
  const { data: categories } = await api.getAllCategories();
  const { data: brands } = await api.getAllBrandsByAdmin();
  const { data: shops } = await api.getAllShopsByAdmin();
  const { data: attributes } = await api.getAllAttributesByAdmin();
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Add Product"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Products',
            href: '/admin/products'
          },
          {
            name: 'Add Product'
          }
        ]}
      />
      <AddProduct brands={brands} shops={shops} categories={categories} attributes={attributes} />
    </div>
  );
}
