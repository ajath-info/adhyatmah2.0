'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Stack } from '@mui/material';

const tabs = [
  { label: 'Profile', path: '/admin/settings' },
  { label: 'Main', path: '/admin/settings/main' },
  { label: 'General', path: '/admin/settings/general' },
  { label: 'Branding', path: '/admin/settings/branding' },
  { label: 'Home', path: '/admin/settings/home' },
  { label: 'Change Password', path: '/admin/settings/change-password' }
];

export default function SettingsTabs() {
  const pathname = usePathname();

  return (
    <Stack direction="row" gap={1} sx={{ mb: 3, flexWrap: { sm: 'no-wrap', xs: 'wrap' } }}>
      {tabs.map((tab) => (
        <Button
          key={tab.path}
          component={Link}
          href={tab.path}
          variant={pathname === tab.path ? 'contained' : 'outlined'}
          color={pathname === tab.path ? 'primary' : 'inherit'}
        >
          {tab.label}
        </Button>
      ))}
    </Stack>
  );
}
