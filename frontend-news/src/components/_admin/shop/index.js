'use client';
import React from 'react';
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
import ShopForm from '@/components/forms/shop';

export default function AdminShopMain({ slug }) {
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['shop-details-by-admin', slug],
    queryFn: () => api.getShopDetailsByAdmin(slug)
  });
  return <ShopForm isShopLoading={isLoading} shop={data?.data} type="admin" />;
}
