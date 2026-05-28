'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
// mui
import { Card, Button, CardHeader, Typography, Box, Skeleton, Stack, Divider } from '@mui/material';
import { sum } from 'lodash';
// formik
import { useFormik, Form, FormikProvider } from 'formik';
// icons
import { IoArrowBackOutline } from 'react-icons/io5';
import { MdOutlineShoppingCart } from 'react-icons/md';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { deleteCart, increaseQuantity, decreaseQuantity, getCart, resetCart } from 'src/redux/slices/product';
// component

import CartItemsList from '@/components/lists/cart-items';
// Styled
import RootStyled from './styled';
import EmptyCart from '@/illustrations/empty-cart';

ShoppingCart.propTypes = {
  loading: PropTypes.bool.isRequired
};

// ----------------------------------------------------------------------

export default function ShoppingCart({ loading }) {
  const dispatch = useDispatch();

  const { checkout } = useSelector(({ product }) => product);
  const { cart, shipping } = checkout;

  const [count, setCount] = React.useState(0);

  const isEmptyCart = cart.length === 0;
  const handleDeleteCart = (productId) => {
    dispatch(deleteCart(productId));
    setCount((prev) => prev + 1);
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
    setCount((prev) => prev + 1);
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
    setCount((prev) => prev + 1);
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { products: [] },
    onSubmit: () => {}
  });
  const { handleSubmit } = formik;
  const totalItems = sum(cart?.map((item) => item.quantity));

  React.useEffect(() => {
    dispatch(getCart({ cart, shipping }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <RootStyled>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card className="card-main">
            <CardHeader
              className="card-header"
              title={
                loading ? (
                  <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} width={120} />
                ) : (
                  <Stack direction={'row'} gap={0.5} alignItems={'center'}>
                    <Typography variant="h4">Shopping Cart</Typography>
                    <Typography component="h5" color="text.secondary">
                      &nbsp;( {totalItems} {totalItems > 1 ? 'items' : 'item'} )
                    </Typography>
                  </Stack>
                )
              }
            />

            {!isEmptyCart ? (
              <>
                <Box className="product-list">
                  <CartItemsList
                    formik={formik}
                    onDelete={handleDeleteCart}
                    onIncreaseQuantity={handleIncreaseQuantity}
                    onDecreaseQuantity={handleDecreaseQuantity}
                    isLoading={loading}
                    cart={cart}
                  />
                </Box>
              </>
            ) : (
              <EmptyCart />
            )}
            <Divider />
            <Stack mt={2} direction="row " justifyContent="space-between" alignItems="center">
              <Button href="/" component={Link} color="inherit" startIcon={<IoArrowBackOutline />}>
                Continue Shopping
              </Button>
              <Button
                color="error"
                onClick={() => dispatch(resetCart())}
                startIcon={<MdOutlineShoppingCart />}
                disabled={isEmptyCart}
              >
                Clear Cart
              </Button>
            </Stack>
          </Card>
        </Form>
      </FormikProvider>
    </RootStyled>
  );
}
