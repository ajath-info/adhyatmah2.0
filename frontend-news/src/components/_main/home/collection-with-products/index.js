'use client';
import React from 'react';

// mui
import { 
  Typography, 
  Container, 
  Stack, 
  Grid
} from '@mui/material';

// components
import ProductsCarousel from '@/components/carousels/products-grid-slider';

export default function CollectionWithProducts({ data, title, description }) {
  // Transform API data to match ProductCard expected format
  const transformProductData = (products) => {
    return products.map(product => ({
      _id: product.id,
      name: product.title,
      slug: product.handle,
      images: product.featuredImage ? [{ url: product.featuredImage.url, altText: product.featuredImage.altText }] : [],
      price: parseFloat(product.variant?.price?.amount) || 0,
      salePrice: parseFloat(product.variant?.price?.amount) || 0,
      stockQuantity: 10, // Default stock quantity
      averageRating: 0, // Default rating
      variant: product.variant?.selectedOptions?.[0]?.value || 'Default Title'
    }));
  };

  return (
    <Container maxWidth="xl">
      <Stack gap={3}>
        <Stack>
          <Typography variant="h2" color="text.primary">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </Stack>

        {!Boolean(data.length) ? (
          <Typography variant="h3" color="error.main" textAlign="center">
            Collections not found
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {data.map((collection, index) => (
              <Grid item xs={12} key={collection.id || index}>
                <Stack gap={3}>
                  {/* Products Carousel */}
                  {collection.products && collection.products.length > 0 && (
                    <ProductsCarousel 
                      data={transformProductData(collection.products)} 
                      isLoading={false}
                      query={`?collection=${collection.handle}`}
                    />
                  )}
                </Stack>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
}
