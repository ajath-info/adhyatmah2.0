import React from 'react';

// mui
import { Card, Container, Stack, Typography } from '@mui/material';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import AccountChangePassword from '@/components/forms/settings/change-password-form';

export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        heading="Change Passwrd"
        admin
        links={[
          {
            name: 'Dashboard',
            href: '/vendor/dashboard'
          },
          {
            name: 'Settings',
            href: '/vendor/settings'
          },
          {
            name: 'Change Password'
          }
        ]}
      />
      <Container maxWidth="sm">
        <Card
          sx={{
            maxWidth: 560,
            m: 'auto',
            my: '80px',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 3
          }}
        >
          <Stack mb={5}>
            <Typography textAlign="center" variant="h4" component="h1" gutterBottom>
              Change Password
            </Typography>
            <Typography textAlign="center" color="text.secondary">
              Change your password by logging into your account.
            </Typography>
          </Stack>
          <AccountChangePassword />
        </Card>
      </Container>
    </div>
  );
}
