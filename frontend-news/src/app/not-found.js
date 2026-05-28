'use client';

import React from 'react';
import { useRouter } from '@bprogress/next';

import { Box, Button, Typography } from '@mui/material';
import NotFoundIllustration from 'src/illustrations/data-not-found';

export default function NotFound() {
  const router = useRouter();

  return (
    <Box
      sx={{
        px: 2,
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 3,
        svg: { width: '100%' }
      }}
    >
      <NotFoundIllustration />
      <Typography variant="h4" color="text.primary">
        404 — Page Not Found
      </Typography>

      <Typography variant="body1" color="text.primary">
        Something went wrong. The requested page could not be found.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" size="large" onClick={() => router.back()}>
          Go Back
        </Button>

        <Button component="a" href="/" variant="outlined" color="primary" size="large">
          Go To Home
        </Button>
      </Box>
    </Box>
  );
}
