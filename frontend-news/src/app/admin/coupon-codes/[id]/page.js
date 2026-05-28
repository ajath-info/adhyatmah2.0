'use client';
import React, { use } from 'react';

import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import EditCouponCode from '@/components/_admin/coupon-codes/edit-coupon-code';
import * as api from 'src/services';
// usequery
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';

Page.propTypes = { params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired };
export default function Page(props) {
  const params = use(props.params);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['coupon-codes', params.id],
    queryFn: () => api.getCouponCodeByAdmin(params.id)
  });

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Coupon Code"
        links={[
          { name: 'Dashboard', href: '/admin/dashboard' },
          { name: 'Brands', href: '/admin/brands' },
          { name: 'Edit Coupon Code' }
        ]}
      />
      <EditCouponCode data={data?.data} isLoading={isLoading} />
    </div>
  );
}
