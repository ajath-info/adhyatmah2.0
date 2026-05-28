'use client';
import React from 'react';
// components
import CompareTable from '@/components/table/compare-table';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
export default function CompareMain() {
  const { products: compareProducts } = useSelector(({ compare }) => compare);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['get-brands-user', compareProducts],
    queryFn: () => api.getCompareProducts(compareProducts)
  });

  return <CompareTable data={data?.data || []} isLoading={isLoading} />;
}
