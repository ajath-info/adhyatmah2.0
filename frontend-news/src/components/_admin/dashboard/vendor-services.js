'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'next/navigation';
// mui
import { Dialog } from '@mui/material';
// components
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import Service from 'src/components/table/rows/service';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';

const TABLE_HEAD = [
  { id: 'poojaType', label: 'Service' },
  { id: 'price', label: 'Price' },
  { id: 'duration', label: 'Duration' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Date' },
  { id: '', label: 'Actions' }
];

VendorServices.propTypes = { isVendor: PropTypes.bool };
export default function VendorServices({ isVendor }) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['vendor-services', apicall, pageParam],
    queryFn: () => api.getVendorServices(+pageParam || 1)
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
          endPoint={'deleteVendorService'}
          type={'Service deleted'}
          deleteMessage={
            'Are you really sure you want to remove this service? Just making sure before we go ahead with it.'
          }
        />
      </Dialog>
      {(isLoading || Boolean(data?.data?.length)) && (
        <Table
          heading={'Services'}
          isDashboard
          headData={TABLE_HEAD}
          data={data}
          isLoading={isLoading}
          row={Service}
          handleClickOpen={handleClickOpen}
          isVendor={isVendor}
        />
      )}
    </>
  );
}
