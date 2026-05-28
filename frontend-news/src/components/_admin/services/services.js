'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
// mui
import { Dialog, Stack } from '@mui/material';
import DeleteDialog from 'src/components/dialog/delete';
// components
import Table from 'src/components/table/table';
import Service from 'src/components/table/rows/service';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';

const TABLE_HEAD = [
  { id: 'poojaType', label: 'Pooja Service' },
  { id: 'price', label: 'Price' },
  { id: 'duration', label: 'Duration' },
  { id: 'status', label: 'Status' },
  { id: 'description', label: 'Description' },
  { id: 'createdAt', label: 'Date' },
  { id: '', label: 'Actions' }
];

export default function VendorServicesMain({ isVendor }) {
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);
  
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['vendor-services', apicall, searchParams.toString(), isVendor],
    queryFn: () => isVendor 
      ? api.getServicesByVendor(searchParams.toString())
      : api.getServicesByAdmin(searchParams.toString())
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
          endPoint={isVendor ? "deleteServiceByVendor" : "deleteServiceByAdmin"}
          type={'Service deleted'}
          deleteMessage={
            'Are you really sure you want to remove this pooja service? Just making sure before we go ahead with it.'
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
        row={Service}
        handleClickOpen={handleClickOpen}
        isVendor={isVendor}
        isSearch
      />
    </>
  );
}

VendorServicesMain.propTypes = {
  isVendor: PropTypes.bool
};
