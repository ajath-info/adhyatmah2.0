// react
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import { useRouter } from '@bprogress/next';
import PropTypes from 'prop-types';
// mui
import { Box, Stack, Button, IconButton, Typography, FormHelperText, Rating, Tooltip, Chip } from '@mui/material';
// formik
import { useFormik, Form, FormikProvider } from 'formik';
// redux
import { useDispatch, useSelector } from 'src/redux';
// redux
import { addCart } from 'src/redux/slices/product';
// styles
// import RootStyled from './styled';
import { useCurrencyConvert } from '@/hooks/use-currency';
import { useCurrencyFormat } from '@/hooks/use-currency-format';
import { MdContentCopy } from 'react-icons/md';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { MdLockOutline } from 'react-icons/md';
import { FaRegStar } from 'react-icons/fa';
import { FiShoppingCart } from 'react-icons/fi';
import { IoBagCheckOutline } from 'react-icons/io5';
import { useSearchParams } from 'next/navigation';
import { FiExternalLink } from 'react-icons/fi';
import VariantSelection from '../variant-selection';
import SocialShare from '../social-share';
import Incrementer from '@/components/incrementer';

ProductDetailsSumary.propTypes = {
  product: PropTypes.object.isRequired,

  id: PropTypes.string.isRequired,
  totalRating: PropTypes.number.isRequired,

  onClickWishList: PropTypes.func.isRequired,
  wishlist: PropTypes.array.isRequired
};

export default function ProductDetailsSumary({ ...props }) {
  const { product, totalRating, totalReviews, setSelectedVariant, selectedVariant, isSimpleProduct, isPopup } = props;
  const searchParams = useSearchParams();
  const variantParam = searchParams.get('variant') || '';

  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormat();
  const [isInitialized, setInitialized] = useState(false);
  const [variantObj, setVariantObj] = useState(
    isSimpleProduct
      ? null
      : {
          ...product.variants[0],
          name: product.variants[0].name
        }
  );
  useEffect(() => {
    setInitialized(true);
  }, []);

  const router = useRouter();

  const dispatch = useDispatch();

  const { checkout } = useSelector(({ product }) => product);
  const { user, isAuthenticated } = useSelector(({ user }) => user);
  const isNotUser = user?.role === 'vendor' || user?.role?.includes('admin');
  const [isLoaded, setLoaded] = useState(false);

  const variantList = isSimpleProduct ? [] : product.variants.map((v) => v.name);
  const names = isSimpleProduct ? [] : product.variants[0].variant.split('/');
  const variants = names.map((_, i) => variantList.map((variantObj) => variantObj.split('/')[i]));
  const stockQuantity = isSimpleProduct ? product.stockQuantity : variantObj?.stockQuantity || 0;

  const isMaxQuantity =
    checkout?.cart?.filter((item) => item._id === product._id)?.map((item) => item.quantity)[0] >= stockQuantity;

  const onAddCart = (param) => {
    toast.success('Added to cart');
    dispatch(addCart(param));
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      pid: product._id,

      quantity: 1
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!isAuthenticated) {
          toast.error('Please login first to proceed with purchase');
          router.push('/auth/sign-in?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
          return;
        }
        if (isNotUser) {
          toast.error('Only user can add to cart');
          return;
        }
        const alreadyProduct = checkout.cart.filter(
          (item) => item.sku === (isSimpleProduct ? product : variantObj).sku
        );
        if (!Boolean(alreadyProduct.length)) {
          onAddCart({
            pid: product._id,
            name: product.name,
            sku: (isSimpleProduct ? product : variantObj).sku,
            slug: product.slug + (isSimpleProduct ? '' : '?variant=' + variantObj.name),
            stockQuantity,
            type: product.type,
            deliveryType: product.deliveryType,
            ...(product.deliveryType === 'digital' && {
              downloadLink: (isSimpleProduct ? product : variantObj).downloadLink
            }),
            ...(!isSimpleProduct && {
              variant: variantObj.name,
              variantName: variantObj.variant
            }),
            image: (isSimpleProduct ? product : variantObj).images[0].url,
            quantity: values.quantity,
            discount:
              (isSimpleProduct ? product : variantObj).price - (isSimpleProduct ? product : variantObj).salePrice,
            price: (isSimpleProduct ? product : variantObj).salePrice || (isSimpleProduct ? product : variantObj).price,
            subtotal:
              ((isSimpleProduct ? product : variantObj).salePrice || (isSimpleProduct ? product : variantObj).price) *
              values.quantity
          });
          setFieldValue('quantity', 1);
        }

        setSubmitting(false);
        router.push('/cart');
      } catch {
        setSubmitting(false);
      }
    }
  });

  const { values, touched, errors, setFieldValue, handleSubmit } = formik;
  const handleAddCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login first to add items to cart');
      router.push('/auth/sign-in?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }
    if (isNotUser) {
      toast.error('Only user can add to cart');
      return;
    }
    const alreadyProduct = checkout.cart.filter(
      (item) => item.sku === (isSimpleProduct ? product : variantObj).sku && item.deliveryType === 'digital'
    );
    if (Boolean(alreadyProduct.length)) {
      toast.error('Product is already in cart');
      return;
    }

    onAddCart({
      pid: product._id,
      name: product.name,
      sku: (isSimpleProduct ? product : variantObj).sku,
      slug: product.slug + (isSimpleProduct ? '' : '?variant=' + variantObj.name),
      stockQuantity,
      type: product.type,
      deliveryType: product.deliveryType,
      ...(product.deliveryType === 'digital' && {
        downloadLink: (isSimpleProduct ? product : variantObj).downloadLink
      }),
      ...(!isSimpleProduct && {
        variant: variantObj.name,
        variantName: variantObj.variant
      }),
      discount: (isSimpleProduct ? product : variantObj).price - (isSimpleProduct ? product : variantObj).salePrice,
      image: (isSimpleProduct ? product : variantObj).images[0].url,
      quantity: values.quantity,
      price: (isSimpleProduct ? product : variantObj).salePrice || (isSimpleProduct ? product : variantObj).price,
      subtotal:
        ((isSimpleProduct ? product : variantObj).salePrice || (isSimpleProduct ? product : variantObj).price) *
        values.quantity
    });

    setFieldValue('quantity', 1);
  };

  const onChangeVariant = (name, i) => {
    let splited = selectedVariant.split('/');
    splited[i] = name;
    const newVariant = splited.join('/');

    setSelectedVariant(newVariant);

    const matched = product.variants.find((v) => v.name === newVariant);
    setVariantObj(matched);
    if (!isPopup) {
      // ✅ Update URL search params
      const params = new URLSearchParams(searchParams.toString());
      params.set('variant', splited.join('_'));
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  };

  useEffect(() => {
    if (variantParam) {
      const formatted = variantParam.replace(/_/g, '/');
      setSelectedVariant(formatted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantParam]);

  useEffect(() => {
    setLoaded(true);
  }, []);

//console.log("PRODUCT DATA:", product);
  return (
    <Box py={2}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack gap={1}>
            <Box>
              {(isSimpleProduct ? product : variantObj).price <=
              (isSimpleProduct ? product : variantObj).salePrice ? null : (
                <Chip
                  color={'success'}
                  label={`-${(100 - ((isSimpleProduct ? product : variantObj).salePrice / (isSimpleProduct ? product : variantObj).price) * 100).toFixed(0)}% Discount`}
                />
              )}
            </Box>
            <Typography
              noWrap
              variant="subtitle1"
              color="primary.main"
              sx={{
                textTransform: 'uppercase'
              }}
            >
              Brand: {product.brand.name}
            </Typography>
			
            <Typography variant="h3" component={'h1'} lineHeight={1}>
              {product.name}
            </Typography>
            <Typography noWrap variant="subtitle1" color="text.secondary">
              Category: {product.category.name}
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Rating value={totalRating} precision={0.1} size="small" readOnly />
                <Typography variant="subtitle2" color="text.secondary">
                  {totalReviews || 0} {totalReviews > 1 ? 'Reviews' : 'Review'}
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              Description: {product.description}
            </Typography>
            {product.deliveryType === 'physical' && (
              <Box>
                <Typography component="span" variant="subtitle1" color="text.primary">
                  Available:
                </Typography>{' '}
                <Typography component="span" variant="body1" color="text.secondary">
                  {stockQuantity ? stockQuantity + ' Items' : 'Out of stock'}
                </Typography>
              </Box>
            )}
            <VariantSelection
              names={names}
              variants={variants}
              product={product}
              selectedVariant={selectedVariant}
              onChangeVariant={onChangeVariant}
            />

            <Stack
              direction={{ sm: 'row', xs: 'column-reverse' }}
              gap={1}
              alignItems={{ sm: 'center', xs: 'start' }}
              justifyContent={'space-between'}
            >
              {product.deliveryType === 'physical' ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <div>
                    <Incrementer
                      quantity={values.quantity}
                      stockQuantity={stockQuantity}
                      onDecrease={() => setFieldValue('quantity', values.quantity - 1)}
                      onIncrease={() => setFieldValue('quantity', values.quantity + 1)}
                    />

                    {touched.quantity && errors.quantity && (
                      <FormHelperText error>{touched.quantity && errors.quantity}</FormHelperText>
                    )}
                  </div>
                </Stack>
              ) : (
                <div />
              )}
              <Stack direction={'row'} gap={1} alignItems="center">
                {product.price <= product.salePrice ? null : (
                  <Typography component="span" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    {isLoaded && (
                      <del>{fCurrency(cCurrency(parseInt((isSimpleProduct ? product : variantObj).price)))}</del>
                    )}
                  </Typography>
                )}{' '}
                <Typography
                  variant="h3"
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {isLoaded && fCurrency(cCurrency(parseInt((isSimpleProduct ? product : variantObj).salePrice)))}{' '}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1}>
              <Button
                fullWidth
                size="large"
                disabled={isMaxQuantity || stockQuantity < 1}
                type="button"
                color="primary"
                variant="contained"
                onClick={() => handleAddCart()}
                startIcon={<FiShoppingCart />}
              >
                Add to Cart
              </Button>
              <Button
                disabled={stockQuantity < 1}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="secondary"
                startIcon={<IoBagCheckOutline />}
              >
                Buy Now
              </Button>{' '}
              {product.deliveryType === 'digital' && Boolean(product.demo) && (
                <Button
                  fullWidth
                  size="large"
                  component={Link}
                  href={product.demo}
                  target="_blank"
                  variant="contained"
                  color="info"
                  startIcon={<FiExternalLink />}
                >
                  View Demo
                </Button>
              )}
            </Stack>

{/*<Stack direction="row" spacing={1} justifyContent={'end'}>
              <Tooltip title="Copy Prooduct URL">
                <IconButton
                  aria-label="copy"
                  onClick={() => {
                    navigator.clipboard.writeText(window?.location.href);
                    toast.success('Link copied.');
                  }}
                >
                  <MdContentCopy size={24} />
                </IconButton>
              </Tooltip>
              {isInitialized && <SocialShare />}
            </Stack>*/}
            <Stack direction="row" alignItems="center" spacing={2} justifyContent={'end'}>
              {shippingData.map((item, index) => (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  my={1}
                  sx={{
                    color: 'text.secondary'
                  }}
                >
                  {item.icon}
                  <Typography variant="subtitle2" color="text.secondary">
                    {item.name}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Form>
      </FormikProvider>
    </Box>
  );
}

const shippingData = [
  {
    icon: <LiaShippingFastSolid size={20} />,
    name: 'All India shipping'
  },
  {
    icon: <MdLockOutline size={20} />,
    name: 'Secure payment'
  },
  {
    icon: <FaRegStar size={20} />,
    name: '24x7 Online Support'
  }
];