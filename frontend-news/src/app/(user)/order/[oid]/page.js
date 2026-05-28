import React from 'react';

// mui
import { Container, Typography, Box, Grid, Stack } from '@mui/material';

// components
import OrderDetails from '@/components/_main/orders/order-details';
import TableCard from '@/components/table/order-table';

// Meta information
export const metadata = {
  title: 'Order Confirmation | adhyatmah- Your Order Has Been Successfully Placed',
  description:
    'Congratulations! Your order has been successfully placed on adhyatmah. Thank you for choosing us for your shopping needs. Expect fast processing and delivery. Stay tuned for updates on your order status. Shop more with adhyatmah!',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah',
  keywords:
    'order confirmation, adhyatmah, order placed, successful order, order processing, order delivery, order status, order updates, fast delivery, shopping confirmation, shopping success, shopping updates, online shopping'
};

export default async function OrderMain(props) {
  const params = await props.params;
  const { oid } = params;
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/orders/' + oid).then((res) => res.json());
  if (!response) {
    notFound();
  }
  const data = response;
  return (
    <Box>
      <Container maxWidth="xl">
        <Stack spacing={1} textAlign="center" mt={8} mb={5} justifyContent="center" alignItems="center">
          <Typography variant="h3">Thank you for your purchase!</Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600 }}>
            Thank you for choosing us! Your purchase is appreciated. We're committed to providing top-notch products and
            service. Stay tuned for updates on your order.
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.primary"
            sx={{
              span: {
                color: 'error.main'
              }
            }}
          >
            Order Number: <span>{data.data?.orderNo}</span>
          </Typography>
        </Stack>

        <Grid container direction={{ xs: 'row', md: 'row-reverse' }} spacing={2}>
          <Grid size={{ md: 4, xs: 12 }}>
            <OrderDetails data={data.data} isLoading={false} currency={data.data.currency} />
          </Grid>
          <Grid size={{ md: 8, xs: 12 }}>
            <TableCard data={data?.data} isLoading={false} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
