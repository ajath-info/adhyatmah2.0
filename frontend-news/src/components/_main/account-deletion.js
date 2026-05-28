import React from 'react';

// mui
import { Container, Stack, Typography, Box } from '@mui/material';

// component
import AccountDeletion from '@/components/forms/account-deletion';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

export default function AccountDeletionPage() {
  return (
    <Container maxWidth="xl">
      <Stack gap={3}>
        <HeaderBreadcrumbs
          heading="Request Account Deletion"
          links={[
            {
              name: 'Home',
              href: '/'
            },
            {
              name: 'Account Deletion'
            }
          ]}
        />
        
        <Box sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
          <AccountDeletion />
        </Box>
      </Stack>
    </Container>
  );
}
