import React from 'react';

// components
import Dashboard from 'src/components/_admin/dashboard';

// Meta information
export const metadata = {
  title: 'adhyatmah - Dashboard',
  description: 'Welcome to the adhyatmah Dashboard. Manage your e-commerce operations with ease.',
  applicationName: 'adhyatmah Dashboard',
  authors: 'adhyatmah',
  keywords: 'dashboard, e-commerce, management, adhyatmah',
  icons: {
    icon: '/favicon.png'
  }
};

export default function page() {
  return <Dashboard isVendor />;
}
