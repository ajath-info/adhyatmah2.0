import React from 'react';

import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import AddCouponCode from '@/components/_admin/coupon-codes/add-coupon-code';
export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Add Cupon Code"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Coupon codes',
            href: '/admin/coupon-codes'
          },
          {
            name: 'Add coupon code'
          }
        ]}
      />
      <AddCouponCode />
    </div>
  );
}
