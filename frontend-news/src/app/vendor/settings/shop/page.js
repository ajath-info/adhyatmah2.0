'use client';
import React from 'react';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
import ShopForm from '@/components/forms/shop';
export default function ShopSetting() {
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['get-vendor-shop'],
    queryFn: api.getVendorShop,
    retry: false
  });
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Pandit Profile Setting"
        links={[
          { name: 'Dashboard', href: '/vendor/dashboard' },
          { name: 'Settings', href: '/vendor/settings' },
          { name: 'Pandit Profile Settings' }
        ]}
      />
      <ShopForm isShopLoading={isLoading} shop={data?.data} type="vendor" />
    </div>
  );
}
