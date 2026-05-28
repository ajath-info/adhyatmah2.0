import React from 'react';

// mui
import { Container, Stack } from '@mui/material';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import CompareMain from 'src/components/_main/compare';

export default function Page() {
  return (
    <Container maxWidth="xl">
      <Stack gap={3}>
        <HeaderBreadcrumbs
          heading="Compare"
          links={[
            {
              name: 'Home',
              href: '/'
            },
            {
              name: 'Compare'
            }
          ]}
        />
        <CompareMain />
      </Stack>
    </Container>
  );
}
