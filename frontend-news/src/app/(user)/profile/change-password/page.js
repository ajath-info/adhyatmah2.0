import React from 'react';

// mui
import { Card, Container, Stack, Typography } from '@mui/material';

// next

import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import AccountChangePassword from '@/components/forms/settings/change-password-form';

// Meta information
export const metadata = {
  title: 'Change Password | adhyatmah- Update Your Account Passwoåård Securely',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah'
};

export default function ChangePassword() {
  return (
    <Container maxWidth="xl">
      <HeaderBreadcrumbs
        heading="Change Password"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Profile',
            href: '/profile/change-password'
          },
          {
            name: 'Change Password'
          }
        ]}
      />
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
  );
}
