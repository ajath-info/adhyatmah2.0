import React from 'react';

// mui
import { Container, Stack } from '@mui/material';
import BrandsMain from '@/components/_main/brands';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// SEO
export const metadata = {
  title: 'Top Puja Product Brands in India | Agarbatti, Diya & Spiritual Essentials Online',

  description: 'Explore trusted puja product brands offering agarbatti, diya, camphor, and spiritual items. Shop authentic products for daily rituals and festivals with reliable quality online.',
};


export default function BrandPage() {
  return (
    <Container maxWidth="xl">
      <Stack gap={3}>
        <HeaderBreadcrumbs heading="All Brands" links={[{ name: 'Home', href: '/' }, { name: 'Brands' }]} />
        <BrandsMain />
      </Stack>
    </Container>
  );
}
