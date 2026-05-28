import React from 'react';

// mui
import { Card, Container, Stack, Typography } from '@mui/material';

// components
import ChangePasswordForm from '@/components/forms/settings/change-password-form';

export default function page() {
  return (
    <div>
      <Container maxWidth="sm">
        <Card
          sx={{
            maxWidth: 560,
            m: 'auto',
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
          <ChangePasswordForm />
        </Card>
      </Container>
    </div>
  );
}
