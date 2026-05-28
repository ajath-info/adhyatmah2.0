'use client';
import React from 'react';

// mui

// components
import ShopDetailCover from '@/components/_admin/shops/shop-detail-cover';
import ShopDetail from '@/components/_admin/shops/shop-details';
import ShopIcomeList from '@/components/_admin/shops/shop-income';

// icons
import { FaGifts } from 'react-icons/fa6';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { TbChartArrowsVertical } from 'react-icons/tb';
import { FaWallet } from 'react-icons/fa6';

// mui
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
import { useTheme, Stack } from '@mui/material';

export default function Page() {
  const theme = useTheme();

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['shop-by-vendor'],
    queryFn: api.getShopDetailsByVendor
  });

  const dataMain = [
    { name: 'Total Income', items: data?.totalEarnings, color: theme.palette.error.main, icon: <FaWallet size={30} /> },
    {
      name: 'Total Commission',
      items: data?.totalCommission,
      color: theme.palette.success.main,
      icon: <TbChartArrowsVertical size={30} />
    },

    {
      name: 'Total Orders',
      items: data?.totalOrders,
      color: theme.palette.secondary.main,
      icon: <HiOutlineClipboardList size={30} />
    },

    {
      name: 'Total Products',
      items: data?.totalProducts,
      color: theme.palette.primary.main,
      icon: <FaGifts size={30} />
    }
  ];
  return (
    <Stack gap={2}>
      <ShopDetailCover data={data?.data} isLoading={isLoading} />
      <ShopDetail data={dataMain} isLoading={isLoading} />
      <ShopIcomeList slug={data?.data?.slug} isVendor onUpdatePayment={() => console.log('clicked')} count={0} />
    </Stack>
  );
}
