'use client';
import React from 'react';
import { useSelector } from 'react-redux';

// mui
import { Grid } from '@mui/material';

// components
import NoDataFound from '@/illustrations/data-not-found';
import ProductCard from 'src/components/cards/product';

// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';

export default function Wishlist() {
  const { wishlist } = useSelector(({ wishlist }) => wishlist);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['get-wishlist-products', wishlist],
    queryFn: () => api.getWishlist(wishlist)
  });

  return (
    <>
      <Grid container justifyContent="start" spacing={2} mt={3}>
        {!isLoading && !Boolean(data?.data.length) && (
          <Grid size={12}>
            <NoDataFound />
          </Grid>
        )}

        {(isLoading ? Array.from(new Array(4)) : data?.data)?.map((item, index) => (
          <Grid size={{ lg: 3, md: 4, sm: 6, xs: 6 }} key={index}>
            <ProductCard product={item} loading={isLoading} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
