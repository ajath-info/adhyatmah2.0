'use client';
import React from 'react';
import { Typography, Grid, Stack } from '@mui/material';
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
import Pagination from 'src/components/pagination';
import { useSearchParams } from 'next/navigation';
import BrandsCard from 'src/components/cards/brand';

export default function BrandsMain() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['get-brands-by-user', page],
    queryFn: () => api.getBrands(page)
  });

  const brands = data?.data || [];
  return (
    <Stack gap={3} mt={3}>
      <Grid container spacing={2} justifyContent="start" alignItems="center">
        {(isLoading ? Array.from(new Array(12)) : brands).map((inner, index) => (
          <Grid size={{ lg: 3, md: 4, sm: 6, xs: 12 }} key={inner?.id || index}>
            <BrandsCard item={inner} isLoading={isLoading} />
          </Grid>
        ))}
      </Grid>
      {!isLoading && brands.length === 0 && (
        <Typography variant="h3" color="error.main" textAlign="center" width="100%">
          Brands not found
        </Typography>
      )}
      <Pagination data={data} />
    </Stack>
  );
}
