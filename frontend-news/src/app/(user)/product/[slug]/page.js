// app/products/[slug]/page.jsx or page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { Box, Container, Stack } from '@mui/material';

import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import ProductDetails from 'src/components/_main/product';
import ProductDetailTabs from 'src/components/_main/product/tabs';
import ProductAdditionalInfo from 'src/components/_main/product/additional-info';
import RelatedProductsCarousel from '@/components/_main/product/related-products';
import ProductContentCard from '@/components/cards/product-content';
// Static generation with ISR
export const revalidate = 60;

// ✅ Base URL (set once for all fetches)
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// ✅ Generate all static paths at build
export async function generateStaticParams() {
  try {
    if (!baseUrl) return [];
    const res = await fetch(`${baseUrl}/api/products-slugs`, {
      next: { revalidate: 3600 } // Cache slug list for 1 hour
    });

    if (!res.ok) return [];

    const { data } = await res.json();

    return data?.map((product) => ({ slug: product.slug })) || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('generateStaticParams: failed to fetch products-slugs', err);
    return [];
  }
}

// ✅ Generate metadata per product
export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    if (!baseUrl) return {};
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: 'force-cache' // Prefer cached
    });

    if (!res.ok) return {};

    const { data: product } = await res.json();

    if (!product) return {};

    const images = product.images || [];

    return {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.shortDescription,
      keywords: product.tags || [],
      openGraph: {
        title: product.name,
        description: product.metaDescription,
        images: images.map((v) => ({ url: v.url }))
      }
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('generateMetadata: failed to fetch product', err);
    return {};
  }
}

// ✅ Main page component
export default async function ProductDetail({ params }) {
  const { slug } = await params;
  try {
    if (!baseUrl) return notFound();

    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!res.ok) return notFound();

    const response = await res.json();

    if (!response?.success || !response?.data) return notFound();

    const { data, totalRating, totalReviews, brand, category } = response;
    const isSimpleProduct = data?.type === 'simple';
    try {
      return (
        <Box>
          <Container maxWidth="xl">
            <Stack direction={'column'} gap={3}>
              <HeaderBreadcrumbs
                heading="Product Details"
                links={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name: data?.name }]}
              />

              <ProductDetails
                data={data}
                brand={brand}
                slug={slug}
                category={category}
                totalRating={totalRating}
                totalReviews={totalReviews}
                isSimpleProduct={isSimpleProduct}
              />
              <ProductContentCard content={data.content} name={data.name} />

              <ProductDetailTabs
                product={{ description: data.content, _id: data._id }}
                totalRating={totalRating}
                totalReviews={totalReviews}
              />

              <ProductAdditionalInfo />

              <RelatedProductsCarousel id={data._id} category={category?.slug} />
            </Stack>
          </Container>
        </Box>
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('ProductDetail: render failed', err);
      return notFound();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('ProductDetail: failed to fetch product data', err);
    return notFound();
  }
}
