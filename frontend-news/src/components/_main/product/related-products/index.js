'use client';
// react
import React from 'react';
import PropTypes from 'prop-types';
// mui
import { Typography } from '@mui/material';
// components
import ProductsCarousel from '@/components/carousels/products-grid-slider';
// styles
import RootStyled from './styled';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';

RelatedProducts.propTypes = { id: PropTypes.string.isRequired };

export default function RelatedProducts({ ...props }) {
  const { id } = props;
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['related-products', id],
    queryFn: () => api.getRelatedProducts(id)
  });

  if (!isLoading && !Boolean(data?.data?.length)) {
    return null;
  }
  return (
    <RootStyled>
      <Typography variant="h2" color="text.primary" className="heading">
        Related Products
      </Typography>
      <Typography variant="body1" color="text.secondary" className="description">
        You may also like these similar items based on your interests and purchases.
      </Typography>
      <ProductsCarousel data={data?.data} isLoading={isLoading} />
    </RootStyled>
  );
}
