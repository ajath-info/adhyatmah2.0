'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
// mui
import { Dialog } from '@mui/material';
// components
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import Shop from 'src/components/table/rows/shop';

const TABLE_HEAD = [
  { id: 'name', label: 'Pandit' },
  { id: 'owner', label: 'Owner' },
  { id: 'products', label: 'products' },
  { id: 'status', label: 'Status' },
  { id: '', label: 'Actions' }
];

export default function AdminProducts() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['admin-shops', apicall, searchParam, pageParam],
    queryFn: () => api.getShopsByAdmin(+pageParam || 1, searchParam || '')
  });
  const handleClickOpen = (prop) => () => {
    setId(prop);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <DeleteDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint={'deleteShop'}
          type={'Pandit profile deleted'}
          deleteMessage={
            'Are you really sure you want to remove this Pandit profile? Just making sure before we go ahead with it.'
          }
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={Shop}
        handleClickOpen={handleClickOpen}
        isSearch
        filters={[{ ...SHOP_STATUS_FILTERS }]}
      />
    </>
  );
}
AdminProducts.propTypes = { isVendor: PropTypes.boolean };

const SHOP_STATUS_FILTERS = {
  name: 'Status',
  param: 'status',
  data: [
    {
      name: 'Approved',
      slug: 'approved'
    },
    {
      name: 'Pending',
      slug: 'pending'
    },
    {
      name: 'In Review',
      slug: 'in-review'
    },
    {
      name: 'Action Required',
      slug: 'action-required'
    },
    {
      name: 'Blocked',
      slug: 'blocked'
    },
    {
      name: 'Rejected',
      slug: 'rejected'
    }
  ]
};
