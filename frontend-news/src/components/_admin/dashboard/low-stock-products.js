'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'next/navigation';
// mui
import { Dialog } from '@mui/material';
// components
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import Product from 'src/components/table/rows/product';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
const TABLE_HEAD = [
  { id: 'name', label: 'Product' },
  { id: 'price', label: 'Price' },
  { id: 'stock', label: 'Stock' },
  { id: 'inventoryType', label: 'Status' },
  { id: 'createdAt', label: 'Date' },
  { id: 'rating', label: 'Rating' },
  { id: '', label: 'Actions' }
];

AdminProducts.propTypes = { isVendor: PropTypes.bool };
export default function AdminProducts({ isVendor }) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['admin-products', apicall, pageParam],
    queryFn: () => api[isVendor ? 'getVendorLowStockProducts' : 'getLowStockProductsByAdmin'](+pageParam || 1)
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
          endPoint={isVendor ? 'deleteVendorProduct' : 'deleteProductByAdmin'}
          type={'Product deleted'}
          deleteMessage={
            'Are you really sure you want to remove this product? Just making sure before we go ahead with it.'
          }
        />
      </Dialog>
      {(isLoading || Boolean(data?.data?.length)) && (
        <Table
          heading={'Low Stock Products'}
          isDashboard
          headData={TABLE_HEAD}
          data={data}
          isLoading={isLoading}
          row={Product}
          handleClickOpen={handleClickOpen}
          isVendor={isVendor}
        />
      )}
    </>
  );
}
