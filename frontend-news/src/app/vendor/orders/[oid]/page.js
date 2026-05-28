'use client';
import React, { use } from 'react';
import PropTypes from 'prop-types';
import CourierDetails from '@/components/_admin/orders/courier-details';
// mui
import { Grid, Box } from '@mui/material';

// components
import OrderDetails from '@/components/_main/orders/order-details';
import TableCard from '@/components/table/order-table';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
import OrderToolbarActions from '@/components/_admin/orders/order-toolbar-actions';
import { useSelector } from '@/redux';
Page.propTypes = { params: PropTypes.shape({ oid: PropTypes.string.isRequired }).isRequired };
export default function Page(props) {
  const { user } = useSelector((state) => state.user);
  const params = use(props.params);
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['order-by-vendor', params.oid],
    queryFn: () => api.getOrderByVendor(params.oid)
  });

  const courierInfo = data?.courierInfo ? data?.courierInfo?.find((v) => v.vendorId === user._id) : null;

  return (
    <Box>
      <HeaderBreadcrumbs
        admin
        links={[
          { name: 'Dashboard', href: '/vendor/dashboard' },
          { name: 'Pandit Bookings', href: '/vendor/orders' },
          { name: 'Pandit Booking Details' }
        ]}
        action={
          <>
            <OrderToolbarActions isVendor data={data?.data} />
          </>
        }
      />

      <Grid container direction={{ xs: 'row', md: 'row-reverse' }} spacing={2}>
        <Grid size={{ md: 4, xs: 12 }}>
          <CourierDetails id={params.oid} isVendor courierInfo={courierInfo} />
          <OrderDetails data={data?.data} isLoading={isLoading} currency={'$'} />
        </Grid>
        <Grid size={{ md: 8, xs: 12 }}>
          <TableCard data={data?.data} isLoading={isLoading} />
        </Grid>
      </Grid>
    </Box>
  );
}
