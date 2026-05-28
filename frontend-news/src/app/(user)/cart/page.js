import React from 'react';

// mui
import { Container } from '@mui/material';

// component
import CartMain from 'src/components/_main/cart';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// guard
import AuthGuard from '@/guards/auth';

// Meta information
export const metadata = {
  title: 'adhyatmah Shopping Cart | adhyatmah - Convenient Shopping Cart for Easy Checkout',
  description:
    'View your shopping cart on adhyatmah for easy checkout. Add, remove, and manage items effortlessly. Enjoy a seamless shopping experience with secure transactions and personalized recommendations. Explore your cart now!',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah',
  keywords:
    'shopping cart, adhyatmah, view cart, cart items, add to cart, remove from cart, manage cart, checkout, online shopping, secure transactions, personalized recommendations, seamless shopping, convenient shopping'
};

export default async function Cart() {
  return (
    <AuthGuard>
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Cart"
          links={[
            {
              name: 'Home',
              href: '/'
            },
            {
              name: 'Products',
              href: '/products'
            },
            {
              name: 'Cart'
            }
          ]}
        />
        <CartMain />
      </Container>
    </AuthGuard>
  );
}
