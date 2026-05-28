import React from 'react';

// mui
import { Toolbar } from '@mui/material';

// components
import Navbar from 'src/layout/_main/navbar';
import Footer from '@/layout/_main/footer';
// import Topbar from 'src/layout/_main/topbar';
import ActionBar from 'src/layout/_main/actionbar';

import Image from 'next/image';
// images
import iconsImg from 'public/PWA-icon.png';
import graphImg from 'public/apple-touch-icon.png';
import fabImg from 'public/favicon.ico';



// Meta information
export const metadata = {
  title: 'Book Pandit Online for Puja & Rituals | Verified Pandit Services',
  description: 'Discover trusted pandits for puja, havan, and all Hindu rituals. Explore services, compare options, and choose experienced pandits for your spiritual needs at home.',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah',
  keywords: 'ecommerce, adhyatmah, Commerce, Sign in adhyatmah, Signin From adhyatmah',
  icons: {
    icon: fabImg
  },
  openGraph: {
    images: graphImg
  }
};

export default async function RootLayout({ children }) {
  return (
    <>
      {/* <Topbar /> */}
      <Navbar />
      <ActionBar />
      {children}
      <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
      <Footer />
    </>
  );
}
