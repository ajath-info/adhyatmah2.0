import React from 'react';
// mui
import { Container, Stack } from '@mui/material';
import ShopMain from '@/components/_main/shop';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

export default function Page() {
  return (
    <Container maxWidth="xl">
      <Stack gap={3}>
        <HeaderBreadcrumbs heading="Create a pandit profile" links={[{ name: 'Home', href: '/' }, { name: 'Create pandit profile' }]} />
        <ShopMain />
      </Stack>
    </Container>
  );
}
