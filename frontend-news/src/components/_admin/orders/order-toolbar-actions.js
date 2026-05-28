'use client';
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';

// component
import OrderPDF from '@/components/_admin/orders/order-pdf';
import OrderStatus from '@/components/_admin/orders/order-status';
// mui

import { Stack, Box, Button } from '@mui/material';
import { useRouter } from '@bprogress/next';
// api
import * as api from 'src/services';
import { useMutation } from '@tanstack/react-query';
// icons
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { MdOutlineFileDownload } from 'react-icons/md';

OrderToolbarActions.propTypes = { data: PropTypes.object.isRequired, isVendor: PropTypes.bool };

export default function OrderToolbarActions({ data, isVendor }) {
  const router = useRouter();
  const { mutate, isPending: deleteLoading } = useMutation({
    mutationFn: api.deleteOrderByAdmin,
    onSuccess: (data) => {
      toast.success(data?.message || 'Order deleted successfully');
      router.push('/admin/orders');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete order');
      router.push('/404');
    }
  });

  return (
    <Box mb={{ sm: 0, xs: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <PDFDownloadLink
          document={<OrderPDF data={data} />}
          fileName={`INVOICE-${data?._id}`}
          style={{ textDecoration: 'none' }}
        >
          {({ loading }) => (
            <Button
              loading={loading}
              variant="contained"
              loadingPosition="start"
              startIcon={<MdOutlineFileDownload />}
              color="info"
            >
              {'download'}
            </Button>
          )}
        </PDFDownloadLink>

        {isVendor ? null : (
          <Button
            variant="contained"
            startIcon={<MdOutlineDeleteOutline />}
            onClick={() => mutate(data?._id)}
            loading={deleteLoading}
            loadingPosition="start"
          >
            {'Delete'}
          </Button>
        )}

        <OrderStatus isVendor={isVendor} data={data} />
      </Stack>
    </Box>
  );
}
