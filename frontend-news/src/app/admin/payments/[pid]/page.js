'use client';
import React, { use } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'next/navigation';
import { fDateShort } from '@/utils/format-time';

// mui

// components
import Table from 'src/components/table/table';
import OrderList from '@/components/table/rows/order';
import ShopDetailCover from '@/components/_admin/shops/shop-detail-cover';
import ShopDetail from '@/components/_admin/shops/shop-details';

// icons
import { FaWallet } from 'react-icons/fa6';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { TbChartArrowsVertical } from 'react-icons/tb';
import { GrStatusGood } from 'react-icons/gr';
import { GrStatusUnknown } from 'react-icons/gr';
import { CiNoWaitingSign } from 'react-icons/ci';

// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
import { useTheme, Stack } from '@mui/material';

const TABLE_HEAD = [
  { id: 'name', label: 'User' },
  { id: 'total', label: 'Total' },
  { id: 'items', label: 'items' },
  { id: 'inventoryType', label: 'status' },
  { id: 'createdAt', label: 'Date' },
  { id: '', label: 'actions' }
];

Page.propTypes = { params: PropTypes.object };
export default function Page(props) {
  const params = use(props.params);

  const { pid } = params;

  const theme = useTheme();

  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['shop-payment', pid, pageParam],
    queryFn: () => api.getIncomeDetailsByAdmin(pid, pageParam)
  });

  const dataMain = [
    {
      name: 'Total Income',
      items: data?.payment?.totalIncome,
      color: theme.palette.error.main,
      icon: <FaWallet size={30} />
    },
    {
      name: 'Total Commission',
      items: data?.payment?.totalCommission,
      color: theme.palette.success.main,
      icon: <TbChartArrowsVertical size={30} />
    },

    {
      name: 'Total Orders',
      items: data?.data.total,
      color: theme.palette.secondary.main,
      icon: <HiOutlineClipboardList size={30} />
    },

    {
      name: 'Status ( ' + data?.payment?.status?.toUpperCase() + ' )',
      items: fDateShort(data?.payment?.date || new Date())?.slice(3),
      color: theme.palette.primary.main,
      icon:
        data?.payment?.status === 'paid' ? (
          <GrStatusGood size={30} />
        ) : data?.payment?.status === 'pending' ? (
          <GrStatusUnknown size={30} />
        ) : (
          <CiNoWaitingSign size={30} />
        )
    }
  ];
  return (
    <Stack gap={2}>
      <ShopDetailCover data={data?.shop} isLoading={isLoading} />
      <ShopDetail data={dataMain} isLoading={isLoading} />

      <Table
        headData={TABLE_HEAD}
        data={data?.data}
        isLoading={isLoading}
        row={OrderList}
        handleClickOpen={() => console.log('clicked')}
      />
    </Stack>
  );
}
