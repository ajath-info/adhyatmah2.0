'use client';
import React from 'react';
import PropTypes from 'prop-types';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
// components
import ProductDetailsReview from '../reviews';
TabsIndex.propTypes = {
  product: PropTypes.object.isRequired,
  totalRating: PropTypes.number.isRequired,
  totalReviews: PropTypes.number.isRequired
};

export default function TabsIndex({ product, totalRating, totalReviews }) {
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['reviews-summary', product._id],
    queryFn: () => api.getProductReviews(product._id)
  });
  return !isLoading ? (
    <ProductDetailsReview
      isLoading={isLoading}
      reviewsSummery={data?.reviewsSummery}
      totalRating={totalRating}
      totalReviews={totalReviews}
      reviews={data?.reviews || []}
      pid={product?._id}
    />
  ) : (
    <></>
  );
}
