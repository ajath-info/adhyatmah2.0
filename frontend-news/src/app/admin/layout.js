import React from 'react';
export const dynamic = 'force-dynamic';

// guard

import AdminGuard from 'src/guards/admin';

// layout
import DashboardLayout from '@/layout/_admin';
export async function generateMetadata() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    if (!baseUrl)
      return {
        title: 'adhyatmah E-commerce Script | Your Gateway to Seamless Shopping and Secure Transactions',
        description:
          'Log in to adhyatmah for secure access to your account. Enjoy seamless shopping, personalized experiences, and hassle-free transactions. Your trusted portal to a world of convenience awaits. Login now!',
        applicationName: 'adhyatmah',
        authors: 'adhyatmah',
        keywords: 'ecommerce, adhyatmah, Commerce, Sign in adhyatmah, Signin From adhyatmah',
        icons: {
          icon: 'https://adhyatmah.vercel.app/favicon.png'
        },
        openGraph: {
          images: 'https://adhyatmah.vercel.app/opengraph-image.png?1c6a1fa20db2840f'
        }
      };

    const res = await fetch(`${baseUrl}/api/settings/main`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('failed to fetch settings');
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
          data.logoLight?.url ||
          data.logoDark?.url ||
          'https://adhyatmah.vercel.app/opengraph-image.png?1c6a1fa20db2840f'
      }
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('generateMetadata: failed to fetch admin main settings', err);
    return {
      title: 'adhyatmah E-commerce Script | Your Gateway to Seamless Shopping and Secure Transactions',
      description:
        'Log in to adhyatmah for secure access to your account. Enjoy seamless shopping, personalized experiences, and hassle-free transactions. Your trusted portal to a world of convenience awaits. Login now!',
      applicationName: 'adhyatmah',
      authors: 'adhyatmah',
      keywords: 'ecommerce, adhyatmah, Commerce, Sign in adhyatmah, Signin From adhyatmah',
      icons: {
        icon: 'https://adhyatmah.vercel.app/favicon.png'
      },
      openGraph: {
        images: 'https://adhyatmah.vercel.app/opengraph-image.png?1c6a1fa20db2840f'
      }
    };
  }
}
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export default async function layout({ children }) {
  try {
    let branding = null;
    if (baseUrl) {
      try {
        const res = await fetch(`${baseUrl}/api/settings/branding`, { next: { revalidate: 60 } });
        if (res.ok) {
          const json = await res.json();
          branding = json?.data || null;
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Admin layout: failed to fetch branding', err);
        branding = null;
      }
    }

    return (
      <AdminGuard>
        <DashboardLayout branding={branding}>{children}</DashboardLayout>
      </AdminGuard>
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Admin layout: unexpected error', err);
    return (
      <AdminGuard>
        <DashboardLayout branding={null}>{children}</DashboardLayout>
      </AdminGuard>
    );
  }
}
