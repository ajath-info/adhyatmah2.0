'use client';
import React from 'react';
import Link from 'next/link';

// mui
import { Typography, Container, Stack, Button } from '@mui/material';

// components
import CategoryCard from 'src/components/cards/category';
import ProductsCarousel from '@/components/carousels/products-grid-slider';

export default function CategoriesWithProducts({ data, isHome }) {
  // Transform API data to match ProductCard expected format
  const transformProductData = (products) => {
    return products.map((product) => ({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      images: product.images || [],
      price: product.price || 0,
      salePrice: product.salePrice || 0,
      stockQuantity: product.stockQuantity || 0,
      averageRating: product.averageRating || 0,
      discount: product.discount || 0,
      type: product.type || 'simple',
      likes: product.likes || 0
    }));
  };

  // Get limited products (max 4) and check if there are more
  const getLimitedProducts = (products) => {
    if (!products || products.length === 0) return { limited: [], hasMore: false };

    const limited = products.slice(0, 4);
    const hasMore = products.length > 4;

    return { limited, hasMore };
  };

  return (
    <Container maxWidth="xl">
      <Stack gap={4}>
        {/* {isHome && (
          <Stack>
            <Typography variant="h2" color="text.primary">
              Categories & Products
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Discover our most popular categories with their featured products, carefully curated to help you find the
              best products quickly and easily.
            </Typography>
          </Stack>
        )} */}

        {data.map((category) => {
          const { limited: limitedProducts, hasMore } = getLimitedProducts(category.products);

          return (
            <Stack key={category._id} gap={3}>
              {/* Category Header with View All Button */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack>
                  <Typography variant="h4" color="text.primary">
                    {category.name}
                  </Typography>
                  <Typography variant="p" color="text.secondary">
                    {category.name}
                  </Typography>
                </Stack>
                {/* description */}

                {/* {hasMore && (
                  <Button
                    component={Link}
                    href={`/products?category=${category.slug}`}
                    variant="outlined"
                    color="primary"
                    size="small"
                  >
                    View All
                  </Button>
                )} */}
              </Stack>

              {/* Category Products - Only show first 4 using ProductsCarousel for full functionality */}
              {limitedProducts.length > 0 && (
                <ProductsCarousel
                  data={transformProductData(limitedProducts)}
                  isLoading={false}
                  query={`?category=${category.slug}`}
                />
              )}
            </Stack>
          );
        })}

        {isHome && !Boolean(data.length) && (
          <Typography variant="h3" color="error.main" textAlign="center">
            Categories with products not found
          </Typography>
        )}
      </Stack>
    </Container>
  );
}
