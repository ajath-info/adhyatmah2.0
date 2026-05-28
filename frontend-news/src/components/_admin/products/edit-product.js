'use client';
import React from 'react';
import PropTypes from 'prop-types';
// components
import ProductForm from 'src/components/forms/product';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
EditProduct.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  slug: PropTypes.string.isRequired,
  isVendor: PropTypes.boolean
};

export default function EditProduct({ brands, categories, slug, shops, isVendor }) {
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['coupon-codes', slug, isVendor], // Added slug and isVendor as dependencies
    queryFn: () => api[isVendor ? 'getVendorProductBySlug' : 'getProductBySlug'](slug)
  });
  return (
    <ProductForm
      shops={shops}
      brands={brands}
      categories={categories}
      currentProduct={data?.data}
      isLoading={isLoading}
      isVendor={isVendor}
    />
  );
}
