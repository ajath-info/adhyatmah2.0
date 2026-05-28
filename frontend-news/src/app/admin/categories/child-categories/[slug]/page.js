'use client';
import React, { use } from 'react';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import EditChildCategory from '@/components/_admin/categories/child/edit-category';

// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';

Page.propTypes = { params: PropTypes.shape({ slug: PropTypes.string.isRequired }).isRequired };
export default function Page(props) {
  const params = use(props.params);
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['child-category-admin', params.slug],
    queryFn: () => api.getChildCategoryByAdmin(params.slug)
  });
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Child Category"
        links={[
          { name: 'Dashboard', href: '/admin/dashboard' },
          { name: 'Child Categories', href: '/admin/categories/child-categories' },
          { name: 'Edit Child Category' }
        ]}
      />
      <EditChildCategory data={data?.data} categories={data?.categories} isLoading={isLoading} />
    </div>
  );
}
