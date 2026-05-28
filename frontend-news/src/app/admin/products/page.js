import React from 'react';

// components
import ProductsMain from '@/components/_admin/products/products';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// api
import * as api from 'src/services';

// Meta information
export const metadata = {
  title: 'Products - adhyatmah',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah'
};
export const dynamic = 'force-dynamic';

export default async function AdminProducts() {
  const { data: categories } = await api.getAllCategoriesByAdmin();
  const { data: brands } = await api.getAllBrandsByAdmin();
  const { data: shops } = await api.getAllShopsByAdmin();

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Products List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Products'
          }
        ]}
        action={{
          href: `/admin/products/add`,
          title: 'Add Product'
        }}
      />
      <ProductsMain categories={categories} shops={shops} brands={brands} />
    </div>
  );
}
