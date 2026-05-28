'use client';
import React from 'react';
import Stack from '@mui/material/Stack';
import SettingTabs from 'src/components/_admin/settings/settings-tabs';
export default function SettingsMain({ children }) {
  return (
    <Stack gap={2}>
      <SettingTabs />
      {children}
    </Stack>
  );
}
