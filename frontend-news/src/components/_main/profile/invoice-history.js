'use client';
// react
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
// mui
import { Box } from '@mui/material';

// api
import * as api from 'src/services';
// components
import Table from 'src/components/table/table';
import OrderRow from '@/components/table/rows/order-row';
import OrderCard from 'src/components/cards/order';

export default function InvoiceHistory() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['user-invoice', pageParam],
    queryFn: () => api.getUserInvoice(`?page=${pageParam || 1}`)
  });

  const tableData = {
    data: isLoading ? null : data?.data,

    count: data?.data.count
  };

  const TABLE_HEAD = [
    { id: 'name', label: 'Product' },
    { id: 'items', label: 'Items' },
    { id: 'total', label: 'Total' },
    { id: 'inventoryType', label: 'Status' },
    { id: 'createdAt', label: 'Date' },
    { id: 'action', label: 'Action' }
  ];

  return (
    <Box mt={3}>
      {isLoading ? null : (
        <Table headData={TABLE_HEAD} data={tableData} isLoading={false} row={OrderRow} mobileRow={OrderCard} />
      )}
    </Box>
  );
}
