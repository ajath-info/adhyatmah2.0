'use client';
import React, { use } from 'react';
import PropTypes from 'prop-types';

// mui
import { Grid, Box, Alert, Skeleton } from '@mui/material';

// components
import OrderDetails from '@/components/_main/orders/order-details';
import TableCard from '@/components/table/order-table';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import OrderToolbarActions from '@/components/_admin/orders/order-toolbar-actions';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';

OrderDetail.propTypes = { params: PropTypes.shape({ oid: PropTypes.string.isRequired }).isRequired };
export default function OrderDetail(props) {
  const params = use(props.params);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['order-by-admin', params.oid],
    queryFn: () => api.getOrderByAdmin(params.oid)
  });
  const order = isLoading ? null : data?.data;
  return (
    <Box>
      <HeaderBreadcrumbs
        admin
        heading="Order details"
        links={[
          { name: 'Dashboard', href: '/admin/dashboard' },
          { name: 'Orders', href: '/admin/orders' },
          { name: 'Order details' }
        ]}
        action={
          <>
            <OrderToolbarActions data={order} />
          </>
        }
      />

      <Grid container direction={{ xs: 'row', md: 'row-reverse' }} spacing={2}>
        <Grid size={{ md: 4, xs: 12 }}>
          {isLoading ? (
            <Skeleton variant="rounded" height={48} width="100%" />
          ) : order?.description ? (
            <Alert severity="success" color="warning">
              {order?.description}
            </Alert>
          ) : null}
          {isLoading || order?.description ? <br /> : null}

          <OrderDetails data={order} isLoading={isLoading} currency={'$'} />
        </Grid>
        <Grid size={{ md: 8, xs: 12 }}>
          <TableCard data={order} isLoading={isLoading} />
        </Grid>
      </Grid>
    </Box>
  );
}
