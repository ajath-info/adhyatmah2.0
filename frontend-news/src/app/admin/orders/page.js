import React from 'react';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import OrdersMain from '@/components/_admin/orders/orders';

// api
import * as api from 'src/services';
// Meta information
export const metadata = {
  title: 'Order - adhyatmah',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah'
};
export default async function page() {
  try {
    let shops = [];
    try {
      const res = await api.getAllShopsByAdmin();
      shops = res?.data || [];
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('admin/orders: failed to fetch shops', err);
      shops = [];
    }

    return (
      <div>
        <HeaderBreadcrumbs
          admin
          heading="Orders List"
          links={[
            {
              name: 'Dashboard',
              href: '/admin/dashboard'
            },
            {
              name: 'Orders'
            }
          ]}
        />
        <OrdersMain shops={shops} />
      </div>
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('admin/orders: unexpected error', err);
    return (
      <div>
        <HeaderBreadcrumbs
          admin
          heading="Orders List"
          links={[{ name: 'Dashboard', href: '/admin/dashboard' }, { name: 'Orders' }]}
        />
        <OrdersMain shops={[]} />
      </div>
    );
  }
}
