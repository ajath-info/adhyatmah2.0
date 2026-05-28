import React from 'react';

// guard
import VendorGuard from '@/guards/vendor';

export const dynamic = 'force-dynamic';

// layout
import VendorLayout from 'src/layout/_vendor';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export async function generateMetadata() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${baseUrl}/api/settings/main`, { next: { revalidate: 60 } });
  const { data } = await res.json();

  return {
    title: 'adhyatmah E-commerce Script | Your Gateway to Seamless Shopping and Secure Transactions',
    description:
      'Log in to adhyatmah for secure access to your account. Enjoy seamless shopping, personalized experiences, and hassle-free transactions. Your trusted portal to a world of convenience awaits. Login now!',
    applicationName: 'adhyatmah',
    authors: 'adhyatmah',
    keywords: 'ecommerce, adhyatmah, Commerce, Sign in adhyatmah, Signin From adhyatmah',
    icons: {
      icon: data.favicon?.url || 'https://adhyatmah.vercel.app/favicon.png'
    },
    openGraph: {
      images:
        data.logoLight?.url || data.logoDark?.url || 'https://adhyatmah.vercel.app/opengraph-image.png?1c6a1fa20db2840f'
    }
  };
}
export default async function layout({ children }) {
  const res = await fetch(`${baseUrl}/api/settings/branding`, { next: { revalidate: 60 } });
  const { data: branding } = await res.json();
  return (
    <VendorGuard>
      <VendorLayout branding={branding}>{children}</VendorLayout>
    </VendorGuard>
  );
}
