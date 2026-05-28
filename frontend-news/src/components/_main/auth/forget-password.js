'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

// mui
import { Box, Button, Container, Typography, Card } from '@mui/material';

// api
import * as api from 'src/services';
import { useMutation } from '@tanstack/react-query';
// icons
import { CiCircleCheck } from 'react-icons/ci';
// components
import ForgetPasswordForm from 'src/components/forms/forget-password';

export default function ForgetPasswordMain() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setloading] = useState(false);
  const { mutate } = useMutation({
    mutationFn: api.forgetPassword,
    onSuccess: () => {
      toast.success('Password reset email sent successfully');
    },
    onError: (err) => {
      const errorMessage =
        typeof err.response?.data?.message === 'string'
          ? err.response.data.message
          : 'Failed to send password reset email';
      toast.error(errorMessage);
    },
    onSettled: () => {
      setloading(false); // Runs on both success and error
    }
  });
  return (
    <Container maxWidth="sm">
      <Card
        sx={{
          maxWidth: 560,
          m: 'auto',
          my: '80px',
          flexDirection: 'column',
          justifyContent: 'center',
          p: 3,
          '& .full-width-btn': { mt: 1 }
        }}
      >
        {!sent ? (
          <>
            <Typography variant="h3" textAlign="center" paragraph>
              Forget Password
            </Typography>
            <Typography color="text.secondary" mb={5} textAlign="center">
              Please enter the email address associated with your account and We will email you a link to reset your
              password.
            </Typography>

            <ForgetPasswordForm onSent={() => setSent(true)} onGetEmail={(value) => setEmail(value)} />

            <Button component={Link} href="/auth/sign-in" fullWidth size="large" className="full-width-btn">
              back
            </Button>
          </>
        ) : (
          <Box textAlign="center">
            <Box sx={{ mb: 5, mx: 'auto', display: 'inline-block' }}>
              <CiCircleCheck fontSize={160} />
            </Box>

            <Typography variant="h3" gutterBottom>
              Request Sent
            </Typography>
            <Typography mb={5}>
              Email has been sent to <strong>{email}</strong>.
              <br />
            </Typography>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={loading}
              onClick={() => mutate({ email, origin: window.location.origin })}
            >
              resend
            </Button>
            <Button size="large" fullWidth component={Link} href="/auth/sign-in" className="full-width-btn">
              back
            </Button>
          </Box>
        )}
      </Card>
    </Container>
  );
}
