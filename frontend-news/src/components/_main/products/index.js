'use client';
// react
import React from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'next/navigation';

// mui
import { useMediaQuery } from '@mui/material';

// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
// components
import ProductList from './product-list';
import SortBar from './sortbar';
import Pagination from 'src/components/pagination';
ProductListing.propTypes = { category: PropTypes.object, subCategory: PropTypes.object, shop: PropTypes.object };
// dynamic components

const sortData = [
  { title: 'Top Rated', key: 'top', value: -1 },
  { title: 'Asceding', key: 'name', value: 1 },
  { title: 'Desceding', key: 'name', value: -1 },
  { title: 'Price low to high', key: 'price', value: 1 },
  { title: 'Price high to low', key: 'price', value: -1 },
  { title: 'Oldest', key: 'date', value: 1 },
  { title: 'Newest', key: 'date', value: -1 }
];
const getSearchParams = (searchParams, category, subCategory, childCategory, brand, shop, rate) => {
  const params = new URLSearchParams(searchParams.toString());

  if (category?._id) params.set('category', category.slug);
  if (subCategory?._id) params.set('subcategory', subCategory.slug);
  if (childCategory?._id) params.set('childcategory', childCategory.slug);
  if (brand?._id) params.set('brand', brand.slug);
  if (shop?._id) params.set('shop', shop.slug);
  if (rate) params.set('rate', rate);

  const queryString = params.toString();
  return queryString.length ? '?' + queryString : '';
};
export default function ProductListing({ category, subCategory, childCategory, shop, brand, filters }) {
  const searchParams = useSearchParams();

  const searchQuery = getSearchParams(searchParams, category, subCategory, childCategory, brand, shop);
  const { data, isPending: isLoading } = useQuery({
    queryKey: [searchQuery],
    queryFn: () => api.getProducts(searchQuery)
  });
  const isMobile = useMediaQuery('(max-width:900px)');
  return (
    <>
      <SortBar sortData={sortData} productData={data} isLoading={isLoading} filters={filters} />
      <ProductList data={data} isLoading={isLoading} isMobile={isMobile} />
      <Pagination data={data} />
    </>
  );
}
