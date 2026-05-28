import React from 'react';

// mui
import { Typography, Container, Stack } from '@mui/material';
// api

// components
import ProductsCarousel from '@/components/carousels/products-grid-slider';
export default function Index({ data, title, description, path }) {
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
            Products not found
          </Typography>
        ) : (
          <ProductsCarousel data={data} query={path} />
        )}
      </Stack>
    </Container>
  );
}
