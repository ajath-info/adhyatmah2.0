'use client';
import { ProgressProvider } from '@bprogress/next/app';
import { useTheme } from '@mui/material';
import React from 'react';
export default function Progress({ children }) {
  const theme = useTheme();
  return (
    <ProgressProvider height="2px" color={theme.palette.primary.main} options={{ showSpinner: false }} shallowRouting>
      {children}
    </ProgressProvider>
  );
}
