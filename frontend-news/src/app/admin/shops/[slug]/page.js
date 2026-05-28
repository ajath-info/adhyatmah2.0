'use client';
import React, { use } from 'react';
import PropTypes from 'prop-types';

// mui

// components
import ShopDetailCover from '@/components/_admin/shops/shop-detail-cover';
import ShopDetail from '@/components/_admin/shops/shop-details';
import ShopIcomeList from '../../../../components/_admin/shops/shop-income';

// icons
import { FaGifts } from 'react-icons/fa6';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { TbChartArrowsVertical } from 'react-icons/tb';
import { FaWallet } from 'react-icons/fa6';

// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
import { useTheme, Stack } from '@mui/material';

Page.propTypes = { params: PropTypes.object.isRequired };

export default function Page(props) {
  const params = use(props.params);

  const { slug } = params;

  const theme = useTheme();

  const [count, setCount] = React.useState(0);
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['shop-by-admin', slug, count],
    queryFn: () => api.getShopDetailsByAdmin(slug)
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
    },

    {
      name: 'Government ID',
      url: data?.data?.identityVerification?.governmentId?.url,
      isDoc: true,
      color: theme.palette.primary.main,
      icon: <FaGifts size={30} />
    },
    {
      name: 'Proof Of Address',
      url: data?.data?.identityVerification?.proofOfAddress?.url,
      isDoc: true,
      color: theme.palette.primary.main,
      icon: <FaGifts size={30} />
    }
  ];
  return (
    <Stack gap={2}>
      <ShopDetailCover data={data?.data} isLoading={isLoading} />
      <ShopDetail data={dataMain} docsData={data} isLoading={isLoading} />
      <ShopIcomeList slug={slug} onUpdatePayment={() => setCount((prev) => prev + 1)} count={count} />
    </Stack>
  );
}
