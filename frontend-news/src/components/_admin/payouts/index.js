'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
// components
import Table from 'src/components/table/table';
import PayoutsListRow from '@/components/table/rows/payment';
import EditPaymentDialog from '@/components/dialog/edit-payment';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
const TABLE_HEAD = [
  { id: 'name', label: 'Shop' },
  { id: 'items', label: 'Sale' },
  { id: 'total', label: 'Total' },
  { id: 'earning', label: 'Total Income' },
  { id: 'commission', label: 'commission' },
  { id: 'status', label: 'status' },
  { id: 'createdAt', label: 'Created' },
  { id: '', label: 'actions' }
];
export default function PayoutsMain({ shops }) {
  const searchParams = useSearchParams();

  const [payment, setPayment] = useState(null);
  const [count, setCount] = useState(0);
  const { data, isPending: loadingList } = useQuery({
    queryKey: ['payouts', searchParams.toString(), count],
    queryFn: () => api.getPayoutsByAdmin(searchParams.toString()),
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to load payouts');
    }
  });

  const isLoading = loadingList;
  return (
    <div>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={PayoutsListRow}
        handleClickOpen={(v) => setPayment(v)}
        isPayout
        isSearch
        filters={[
          { name: 'Shop', param: 'shop', data: shops },
          {
            name: 'Status',
            param: 'status',
            data: [
              { name: 'Pending', value: 'pending' },
              { name: 'Paid', slug: 'paid' },
              { name: 'Hold', slug: 'hold' }
            ]
          }
        ]}
      />
      <EditPaymentDialog
        handleClose={() => setPayment(null)}
        open={Boolean(payment)}
        data={payment}
        setCount={setCount}
      />
    </div>
  );
}
