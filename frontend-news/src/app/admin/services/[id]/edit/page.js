'use client';
import React from 'react';
import PropTypes from 'prop-types';
// components
import ServiceForm from '@/components/forms/service';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';

export default function EditService({ params }) {
  const { id } = params;
  
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['admin-service', id],
    queryFn: () => api.getServiceByAdmin(id)
  });

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Pandit Service"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Pandit Services',
            href: '/admin/services'
          },
          {
            name: 'Edit Pandit Service'
          }
        ]}
      />
      <ServiceForm 
        currentService={data?.data} 
        isLoading={isLoading} 
        isVendor={false}
      />
    </div>
  );
}

EditService.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

