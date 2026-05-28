// app/brands/[slug]/page.jsx or page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { Stack, Container } from '@mui/material';

import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import ProductList from 'src/components/_main/products';
// Static generation with ISR
export const revalidate = 60;

// Base URL
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function generateStaticParams() {
  try {
    if (!baseUrl) return [];
    const res = await fetch(`${baseUrl}/api/brands-slugs`, {
      next: { revalidate: 3600 } // Cache slug list for 1 hour
    });

    if (!res.ok) return [];

    const { data } = await res.json();

    return data?.map((brand) => ({ slug: brand.slug })) || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('generateStaticParams: failed to fetch brands-slugs', err);
    return [];
  }
}

// Generate metadata per brand
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    if (!baseUrl) return {};
    const res = await fetch(`${baseUrl}/api/brands/${slug}`, {
      cache: 'force-cache' // Prefer cached
    });

    if (!res.ok) return {};

    const { data: brand } = await res.json();

    if (!brand) return {};

    return {
      title: brand.metaTitle || brand.name,
      description: brand.metaDescription || brand.description,
      openGraph: {
        title: brand.name,
        description: brand.metaDescription || brand.description
      }
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('generateMetadata: failed to fetch brand', err);
    return {};
  }
}

// Main page component
export default async function BrandDetail({ params }) {
  const { slug } = await params;
  try {
    if (!baseUrl) return notFound();

    const res = await fetch(`${baseUrl}/api/brands/${slug}`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) return notFound();

    const response = await res.json();
    if (!response?.success || !response?.data) return notFound();

    const { data: brand } = response;

    let filters = [];
    try {
      const res2 = await fetch(`${baseUrl}/api/products/filters`, { next: { revalidate: 60 } });
      if (res2.ok) {
        const response2 = await res2.json();
        filters = response2?.data || [];
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('BrandDetail: failed to fetch filters', err);
      filters = [];
    }

    return (
      <Container maxWidth="xl">
        <Stack gap={3}>
          <HeaderBreadcrumbs
            heading={brand?.name}
            links={[{ name: 'Home', href: '/' }, { name: 'Brands', href: '/brands' }, { name: brand?.name }]}
          />
          <ProductList brand={brand} filters={filters} />
        </Stack>
      </Container>
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('BrandDetail: failed to fetch brand data', err);
    return notFound();
  }

  return (
    <Container maxWidth="xl">
      <Stack gap={3}>
        <HeaderBreadcrumbs
          heading={brand?.name}
          links={[{ name: 'Home', href: '/' }, { name: 'Brands', href: '/brands' }, { name: brand?.name }]}
        />
        <ProductList brand={brand} filters={filters} />
      </Stack>
    </Container>
  );
}
