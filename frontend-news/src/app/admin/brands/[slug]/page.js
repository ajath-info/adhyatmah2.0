'use client';
import React, { use } from 'react';
import PropTypes from 'prop-types';

// components
import EditBrand from '@/components/_admin/brands/edit-brand';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// api
import { useQuery } from '@tanstack/react-query';
import * as api from 'src/services';

Page.propTypes = { params: PropTypes.shape({ slug: PropTypes.string.isRequired }).isRequired };

export default function Page(props) {
  const params = use(props.params);
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['coupon-codes', params.slug],
    queryFn: () => api.getBrandByAdmin(params.slug)
  });
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Brands"
        links={[
          { name: 'Dashboard', href: '/admin' },
          { name: 'Brands', href: '/admin/brands' },
          { name: 'Edit Brand' }
        ]}
      />

      <EditBrand data={data?.data} isLoading={isLoading} />
    </div>
  );
}
