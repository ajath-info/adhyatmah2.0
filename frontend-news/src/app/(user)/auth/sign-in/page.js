import React from 'react';
// guard
import GuestGuard from '@/guards/guest';
// mui
import { Card, Stack, Container, Typography } from '@mui/material';
// components
import SignInMain from '@/components/_main/auth/sign-in';

// Meta information
export async function generateMetadata() {
  return {
    title: "Login - Adhyatmah",
    description: "Login to your account to continue",
  };
}
export default async function SignIn() {
  return (
    <GuestGuard>
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
              Sign in
            </Typography>
            <Typography textAlign="center" color="text.secondary">
              Sign in to your account to continue
            </Typography>
          </Stack>

          <SignInMain />
        </Card>
      </Container>
    </GuestGuard>
  );
}
