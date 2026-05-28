'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
// api
import * as api from 'src/services';
// usequery
import { useQuery } from '@tanstack/react-query';
// mui
import { Dialog, Button } from '@mui/material';
// components
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import Currency from 'src/components/table/rows/currency';
import FormDialog from '@/components/dialog/form-dialog';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import { IoMdAdd } from 'react-icons/io';
import CurrencyForm from 'src/components/forms/currency';
const TABLE_HEAD = [
  { id: 'name', label: 'Currency' },
  { id: 'country', label: 'Country' },
  { id: 'rate', label: 'Rate' },
  { id: 'status', label: 'Status' },

  { id: '', label: 'Actions', alignRight: true }
];

export default function BrandList() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);
  const [selected, setSelected] = useState(null);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['brands', apicall, searchParam, pageParam],
    queryFn: () => api.getCurrenciesByAdmin(+pageParam || 1, searchParam || '')
  });

  const handleClickOpen = (prop) => () => {
    setId(prop);
  };
  const handleClose = () => {
    setId(null);
  };

  const onClickEdit = (currency) => {
    setSelected(currency);
  };
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Currencies List"
        links={[
          {
            name: 'Admin Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Currencies'
          }
        ]}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<IoMdAdd size={20} />}
            onClick={() => setSelected(true)}
          >
            Add Currency
          </Button>
        }
      />
      <Dialog onClose={handleClose} open={id} maxWidth={'xs'}>
        <DeleteDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint="deleteCurrencyByAdmin"
          type={'Currency deleted'}
          deleteMessage={
            'Are you sure you want to delete this currency? Please consider carefully before making irreversible changes.'
          }
        />
      </Dialog>
      <FormDialog title={'Currency'} open={selected} handleClose={() => setSelected(null)}>
        <CurrencyForm
          data={typeof selected === 'boolean' ? null : selected}
          handleClose={() => {
            setApicall(!apicall);
            setSelected(null);
          }}
          handleCancel={() => setSelected(null)}
        />
      </FormDialog>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={Currency}
        handleClickOpen={handleClickOpen}
        onClickEdit={onClickEdit}
        isSearch
      />
    </>
  );
}
