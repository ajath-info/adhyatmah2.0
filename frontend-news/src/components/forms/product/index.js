'use client';
import React from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useRouter } from '@bprogress/next';

import { Form, FormikProvider, useFormik } from 'formik';

import { Card, Stack, Skeleton, CardHeader, CardContent, Button, Collapse } from '@mui/material';
// api
import * as api from 'src/services';
import { useMutation } from '@tanstack/react-query';

// components

import SimpleProductForm from './simple-product';
import VariableProductForm from './variable-product';
import GroupAndCategory from './group-and-category';
import ProductInfo from './product-info';
import { productSchema } from '@/validations';
// ----------------------------------------------------------------------
const STATUS_OPTIONS = ['pending', 'draft', 'published'];

// ----------------------------------------------------------------------
const getVariants = (param) => {
  const converted = param.reduce((acc, item) => {
    const attributes = item.name.split('/');
    const variantKeys = item.variant.split('/');

    variantKeys.forEach((key, index) => {
      const existingAttribute = acc.find((attr) => attr.name === key);

      if (existingAttribute) {
        if (!existingAttribute.values.includes(attributes[index])) {
          existingAttribute.values.push(attributes[index]);
        }
      } else {
        acc.push({ name: key, values: [attributes[index]] });
      }
    });

    return acc;
  }, []);
  return converted;
};
export default function ProductForm({
  categories,
  currentProduct,
  isLoading,
  brands,
  shops,
  isVendor,
  attributes = []
}) {
  const router = useRouter();
  const mutationFn = currentProduct
    ? isVendor
      ? api.updateVendorProduct
      : api.updateProductByAdmin
    : isVendor
      ? api.createVendorProduct
      : api.createProductByAdmin;

  const { mutate, isPending: updateLoading } = useMutation({
    mutationFn,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push((isVendor ? '/vendor' : '/admin') + '/products');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  });
  const [count, setCount] = React.useState(0);
  const [initialized, setInitialized] = React.useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      slug: currentProduct?.slug || '',
      metaTitle: currentProduct?.metaTitle || '',
      metaDescription: currentProduct?.metaDescription || '',
      demo: currentProduct?.demo || '',
      tags: currentProduct?.tags || [],
      deliveryType: currentProduct?.deliveryType || 'physical',
      gender: currentProduct?.gender || '',
      content: currentProduct?.content || '',
      brand: currentProduct?.brand?._id || '',
      shop: currentProduct?.shop?._id || '',
      category: currentProduct?.category?._id || '',
      subCategory: currentProduct?.subCategory?._id || '',
      childCategory: currentProduct?.childCategory?._id || '',
      blob: currentProduct?.images || [],
      isFeatured: currentProduct?.isFeatured || false,
      sku: currentProduct?.sku || '',
      type: currentProduct?.type || 'simple',
      downloadLink: currentProduct?.downloadLink || 'simple',
      selectedVariants: getVariants(currentProduct?.variants || []),
      images: currentProduct?.images || [],
      stockQuantity: currentProduct?.stockQuantity || '',
      price: currentProduct?.price || '',
      salePrice: currentProduct?.salePrice
        ? currentProduct?.price !== currentProduct?.salePrice
          ? currentProduct?.salePrice
          : ''
        : '',
      pincode: currentProduct?.pincode || '',
      variants:
        currentProduct?.variants?.map((v) => ({
          ...v,
          salePrice: v?.salePrice && v?.salePrice !== v?.price ? v?.salePrice : ''
        })) || [],
      ...(!isVendor && { status: currentProduct?.status || STATUS_OPTIONS[0] })
    },

    validationSchema: productSchema(isVendor),
    onSubmit: async (values) => {
      const { blob: _blob, selectedVariants: _selectedVariants, ...rest } = values;
      try {
        mutate({
          ...rest,
          salePrice: values.salePrice || values.price,
          ...(currentProduct && { currentSlug: currentProduct.slug })
        });
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { values, handleSubmit } = formik;

  const handleTitleChange = (event) => {
    const title = event.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]+/g, '')
      .replace(/\s+/g, '-'); // convert to lowercase, remove special characters, and replace spaces with hyphens
    formik.setFieldValue('slug', slug); // set the value of slug in the formik state
    formik.handleChange(event); // handle the change in formik
  };

  return (
    <Stack spacing={3}>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Card>
              <CardHeader title={<>{isLoading ? <Skeleton variant="text" width={140} /> : 'Group and category'}</>} />

              <CardContent>
                <GroupAndCategory
                  formik={formik}
                  isVendor={isVendor}
                  shops={shops}
                  brands={brands}
                  categories={categories}
                  options={STATUS_OPTIONS}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader title={<>{isLoading ? <Skeleton variant="text" width={140} /> : 'Product Information'}</>} />
              <CardContent>
                <ProductInfo formik={formik} handleTitleChange={handleTitleChange} isLoading={isLoading} />
              </CardContent>
            </Card>
            {!isLoading && (
              <Card>
                <CardHeader
                  title={
                    isLoading ? (
                      <Skeleton variant="text" height={28} width={260} />
                    ) : values.type === 'simple' ? (
                      'Simple Product Information'
                    ) : (
                      'Product Variation Information'
                    )
                  }
                />
                <Collapse in={Boolean(values.type === 'simple')}>
                  <SimpleProductForm formik={formik} isLoading={isLoading} />
                </Collapse>
                <Collapse in={Boolean(values.type !== 'simple')}>
                  <VariableProductForm
                    formik={formik}
                    isLoading={isLoading}
                    variants={attributes}
                    setCount={setCount}
                    count={count}
                    isInitialized={initialized}
                    setInitialized={setInitialized}
                  />
                </Collapse>
              </Card>
            )}

            <Stack>
              {isLoading ? (
                <Skeleton variant="rounded" sx={{ ml: 'auto' }} width={168} height={56} />
              ) : (
                <Button type="submit" variant="contained" size="large" sx={{ ml: 'auto' }} loading={updateLoading}>
                  {currentProduct ? 'Update Product' : 'Create Product'}
                </Button>
              )}
            </Stack>
          </Stack>
        </Form>
      </FormikProvider>
    </Stack>
  );
}
ProductForm.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      subCategories: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          childCategories: PropTypes.array.isRequired
        })
      )
    })
  ).isRequired,
  currentProduct: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.oneOf(['published', 'draft', 'pending']),
    isFeatured: PropTypes.bool,
    brand: PropTypes.oneOfType([
      PropTypes.string, // If only ID
      PropTypes.object // If populated
    ]),
    deliveryType: PropTypes.bool,
    downloadLink: PropTypes.string,
    likes: PropTypes.number,
    description: PropTypes.string,
    metaTitle: PropTypes.string,
    metaDescription: PropTypes.string,
    slug: PropTypes.string,

    demo: PropTypes.string,
    type: PropTypes.oneOf(['simple', 'variable']),
    variants: PropTypes.array,
    faqs: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string,
        answer: PropTypes.string
      })
    ),
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    subCategory: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    childCategory: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    gender: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    sku: PropTypes.string,
    price: PropTypes.number,
    salePrice: PropTypes.number,
    oldSalePrice: PropTypes.number,
    stockQuantity: PropTypes.number,
    sold: PropTypes.number,

    shop: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    images: PropTypes.array
  }),
  categoryLoading: PropTypes.bool,

  isVendor: PropTypes.bool,
  brands: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
      // ... add other required properties for brands
    })
  )
};
