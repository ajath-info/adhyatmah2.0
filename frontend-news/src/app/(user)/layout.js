import React from 'react';
import { Toolbar } from '@mui/material';

// components
import Navbar from 'src/layout/_main/navbar';
import Footer from '@/layout/_main/footer';
import SecondaryHeader from '@/components/_main/secondary-header';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function RootLayout({ children }) {
  let branding = null;
  let categories = [];

  try {
    if (baseUrl) {
      const [brandingRes, categoriesRes] = await Promise.all([
        fetch(`${baseUrl}/api/settings/branding`, { next: { revalidate: 60 } }),
        fetch(`${baseUrl}/api/all-categories`, { next: { revalidate: 60 } })
      ]);

      if (brandingRes.ok) {
        const json = await brandingRes.json();
        branding = json?.data || null;
      }

      if (categoriesRes.ok) {
        const json = await categoriesRes.json();
        categories = json?.data || [];
      }
    }
  } catch (err) {
    console.warn('Layout fetch error', err);
  }

  return (
    <>
      <Navbar branding={branding} />
      <SecondaryHeader categories={categories} />

      {children}

      <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />

      <Footer branding={branding} />
    </>
  );
}