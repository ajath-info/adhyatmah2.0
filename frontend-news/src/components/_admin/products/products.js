'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
// mui
import { Dialog, Stack } from '@mui/material';
import DeleteDialog from 'src/components/dialog/delete';
// components
import Table from 'src/components/table/table';
import Product from 'src/components/table/rows/product';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';

const TABLE_HEAD = [
  { id: 'name', label: 'Product' },
  { id: 'price', label: 'Price' },
  { id: 'stockQuantity', label: 'Quantity' },
  { id: 'inventoryType', label: 'Status' },
  { id: 'rating', label: 'Rating' },
  { id: 'createdAt', label: 'Date' },
  { id: '', label: 'Actions' }
];

const STATUS_FILTER = {
  name: 'Status',
  param: 'status',
  data: [
    {
      name: 'Low stock',
      key: 'low-stock'
    },
    {
      name: 'Pending',
      slug: 'pending'
    },
    {
      name: 'Draft',
      slug: 'draft'
    },
    {
      name: 'Published',
      slug: 'published'
    }
  ]
};
export default function AdminProductsMain({ brands, categories, shops, isVendor }) {
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['admin-products', apicall, searchParams.toString(), isVendor], // Added isVendor as dependency
    queryFn: () => api[isVendor ? 'getProductsByVendor' : 'getProductsByAdmin'](searchParams.toString())
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
      <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        {}
      </Stack>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={Product}
        handleClickOpen={handleClickOpen}
        brands={isVendor ? [] : brands}
        categories={isVendor ? [] : categories}
        isVendor={isVendor}
        filters={
          isVendor
            ? [{ ...STATUS_FILTER }]
            : [
                { name: 'Shop', param: 'shop', data: shops },
                { name: 'Category', param: 'category', data: categories },
                { name: 'Brand', param: 'brand', data: brands },
                { ...STATUS_FILTER }
              ]
        }
        isSearch
      />
    </>
  );
}
AdminProductsMain.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  isVendor: PropTypes.boolean
};
