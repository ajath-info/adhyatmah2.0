'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
  Skeleton,
  Grid
} from '@mui/material';
import { IoCheckmarkCircle, IoArrowBack } from 'react-icons/io5';
export default function OrderSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderId = params.get('orderId');

  useEffect(() => {
    if (!orderId) {
      setError('Order ID not found');
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        setLoading(true);

        const backendBase = process.env.NEXT_PUBLIC_API_URL || window.location.origin;

        const resp = await fetch(`${backendBase}/api/orders/${orderId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!resp.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await resp.json();

        // FIX: Match your API response
        if (data.success) {
          setOrder(data.data);
        } else {
          setError(data.message || 'Could not fetch order');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const handleContinueShopping = () => router.push('/');
  const handleViewOrder = () => router.push(`/orders/${orderId}`);

  // ----------------------------------------------
  // ERROR STATE
  // ----------------------------------------------
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>
          Order Error
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {error}
        </Typography>
        <Button variant="contained" startIcon={<IoArrowBack />} onClick={handleContinueShopping}>
          Back to Home
        </Button>
      </Container>
    );
  }

  // ----------------------------------------------
  // LOADING STATE
  // ----------------------------------------------
  if (loading || !order) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="rectangular" height={200} />
        </Stack>
      </Container>
    );
  }

  const user = order.user || {}; // Safer shorthand

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* SUCCESS HEADER */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <IoCheckmarkCircle size={80} color="#4caf50" />
        <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold', color: '#4caf50' }}>
          Order Successful!
        </Typography>
        <Typography variant="body1">Thank you for your purchase. Your order has been confirmed.</Typography>
      </Box>

      {/* ORDER DETAILS */}
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Order Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="caption">Order Number</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {order.orderNo || '#' + order._id?.slice(-8)}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="caption">Order Date</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {order.createdAt ? new Date(order.createdAt).toLocaleString('en-US') : 'N/A'}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="caption">Payment Method</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {order.paymentMethod || 'N/A'}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="caption">Payment Status</Typography>
                <Chip
                  label={order.paymentStatus}
                  color={
                    order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'pending' ? 'warning' : 'error'
                  }
                />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="caption">Delivery Status</Typography>
                <Chip
                  label={order.status}
                  color={order.status === 'delivered' ? 'success' : order.status === 'ontheway' ? 'info' : 'warning'}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack>
                <Typography variant="caption">Total Items</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>{order.totalItems}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* USER SHIPPING INFO */}
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Shipping Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Name</Typography>
              <Typography>
                {user.firstName} {user.lastName}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Email</Typography>
              <Typography>{user.email}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Phone</Typography>
              <Typography>{user.phone}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Country</Typography>
              <Typography>{user.country}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="caption">Full Address</Typography>
              <Typography>
                {user.address}, {user.city}, {user.state}, {user.country} - {user.zip}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ORDER ITEMS */}
      {order.items?.length > 0 && (
        <Card sx={{ mb: 4, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Order Items ({order.items.length})
            </Typography>

            <Stack spacing={2}>
              {order.items.map((item, i) => (
                <Box key={i}>
                  <Stack direction="row" justifyContent="space-between">
                    <Stack>
                      <Typography sx={{ fontWeight: 'bold' }}>Product: {item.productId?.slice(-8)}</Typography>
                      <Typography variant="caption">Qty: {item.quantity}</Typography>
                    </Stack>

                    <Typography sx={{ fontWeight: 'bold' }}>₹{item.price.toFixed(2)}</Typography>
                  </Stack>
                  {i < order.items.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* ORDER SUMMARY */}
      <Card sx={{ mb: 4, boxShadow: 2, backgroundColor: '#f5f5f5' }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Subtotal</Typography>
              <Typography>₹{order.subTotal.toFixed(2)}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography>Shipping</Typography>
              <Typography>₹{order.shipping.toFixed(2)}</Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                ₹{order.total.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* BUTTONS */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
        <Button variant="contained" size="large" onClick={handleViewOrder}>
          View Order Details
        </Button>
        <Button variant="outlined" size="large" onClick={handleContinueShopping} startIcon={<IoArrowBack />}>
          Continue Shopping
        </Button>
      </Stack>
    </Container>
  );
}
