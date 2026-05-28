'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from '@bprogress/next';
// mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { IoSearchOutline } from 'react-icons/io5';

import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import { InputAdornment, Stack, Button } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

// components
import NoDataFound from '@/illustrations/data-not-found';
import { useMutation, useQuery } from '@tanstack/react-query';
import BlurImageAvatar from '../avatar';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useCurrencyConvert } from '@/hooks/use-currency';
import { useCurrencyFormat } from '@/hooks/use-currency-format';
// api
import * as api from 'src/services';

Search.propTypes = { onClose: PropTypes.func.isRequired, mobile: PropTypes.bool.isRequired };
export default function Search({ ...props }) {
  const { onClose, mobile, multiSelect, selectedProducts, handleSave } = props;
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormat();
  const [state, setstate] = React.useState({
    products: [],
    selected: selectedProducts || [],
    initialized: false,
    category: '',
    subCategory: '',
    shop: ''
  });

  const router = useRouter();
  const [search, setSearch] = React.useState('');

  const { data: filters, isPending: filtersLoading } = useQuery({
    queryKey: ['get-search-filters'],
    queryFn: api.getSearchFilters
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: api.search,
    onSuccess: (data) => {
      // Extract and transform products from the payload.results structure
      const rawProducts = data?.payload?.results || [];

      // Transform Shopify format to frontend format if needed
      const products = rawProducts.map((product) => {
        // Handle both formats: transformed (with _id, name) and Shopify (with id, title)
        return {
          _id: product._id || product.id,
          name: product.name || product.title,
          slug: product.slug || product.handle,
          category: product.category || 'Product',
          image: {
            url: product.image?.url || product.featuredImage?.url || ''
          },
          salePrice: product.salePrice || parseFloat(product.priceRange?.minVariantPrice?.amount) || 0
        };
      });

      console.log('Transformed search results:', products); // Debug log
      setstate((prev) => ({ ...prev, products }));
    },
    onError: (error) => {
      console.error('Search error:', error); // Debug log
    }
  });

  const [focus, setFocus] = React.useState(true);

  const handleListItemClick = (prop) => {
    if (multiSelect) {
      const matched = state.selected.filter((v) => prop._id === v._id);
      const notMatched = state.selected.filter((v) => prop._id !== v._id);
      if (Boolean(matched.length)) {
        setstate({ ...state, selected: notMatched });
      } else {
        setstate({ ...state, selected: [...state.selected, prop] });
      }
    } else {
      !mobile && onClose(prop);
      router.push(`/product/${prop}`);
    }
  };
  const onKeyDown = (e) => {
    if (e.keyCode == '38' || e.keyCode == '40') {
      setFocus(false);
    }
  };
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      mutate({ query: search, category: state.category, subCategory: state.subCategory, shop: state.shop });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  React.useEffect(() => {
    mutate({ query: search, category: state.category, subCategory: state.subCategory, shop: state.shop });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.category, state.subCategory, state.shop]);

  return (
    <>
      <TextField
        id="standard-basic"
        variant="standard"
        placeholder="Search products"
        onFocus={() => setFocus(true)}
        onKeyDown={onKeyDown}
        onChange={(e) => {
          setSearch(e.target.value);
          setstate({ ...state, initialized: true });
        }}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ justifyContent: 'center' }}>
              {isLoading ? (
                <CircularProgress sx={{ width: '24px !important', height: '24px !important' }} />
              ) : (
                <IoSearchOutline />
              )}
            </InputAdornment>
          )
        }}
        sx={{
          ...(mobile && { position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.paper' }),
          '& .MuiInput-root': { height: { lg: 72, md: 72, sm: 72, xs: 56 } },
          '& .MuiInputAdornment-root': { width: 100, mr: 0, svg: { mx: 'auto', color: 'primary.main' } }
        }}
      />
      {/* <Stack gap={1} direction="row" p={1}>
        <FormControl fullWidth>
          <Stack gap={1}>
            <Typography variant="overline" component={'label'} htmlFor="shops">
              Pandit Ji
            </Typography>
            {filtersLoading ? (
              <Skeleton variant="rounded" height={40} width="100%" />
            ) : (
              <Select
                id="shops"
                size="small"
                labelId="demo-simple-select-label"
                value={state.shop}
                onChange={(e) => setstate({ ...state, shop: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                {filters?.shops.map((pandit) => (
                  <MenuItem value={pandit._id} key={pandit._id}>
                    {pandit.firstName} {pandit.lastName}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Stack>
        </FormControl>
        <FormControl fullWidth>
          <Stack gap={1}>
            <Typography variant="overline" component={'label'} htmlFor="category">
              Category
            </Typography>
            {filtersLoading ? (
              <Skeleton variant="rounded" height={40} width="100%" />
            ) : (
              <Select
                id="category"
                size="small"
                labelId="demo-simple-select-label"
                value={state.category}
                onChange={(e) => setstate({ ...state, category: e.target.value, subCategory: '' })}
              >
                <MenuItem value="">None</MenuItem>
                {filters?.categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Stack>
        </FormControl>
        <FormControl fullWidth>
          <Stack gap={1}>
            <Typography variant="overline" component={'label'} htmlFor="subCategory">
              SubCategory
            </Typography>
            {filtersLoading ? (
              <Skeleton variant="rounded" height={40} width="100%" />
            ) : (
              <Select
                disabled={!Boolean(state.category)}
                id="subCategory"
                size="small"
                labelId="demo-simple-select-label"
                value={state.subCategory}
                onChange={(e) => setstate({ ...state, subCategory: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                {filters?.categories
                  .find((cat) => cat._id === state.category)
                  ?.subCategories.map((subcat) => (
                    <MenuItem value={subcat._id} key={subcat._id}>
                      {subcat.name}
                    </MenuItem>
                  ))}
              </Select>
            )}
          </Stack>
        </FormControl>
      </Stack> */}
      <Divider />
      <Box className="scroll-main">
        <Box sx={{ height: mobile ? 'auto' : '342px', overflow: 'auto' }}>
          {/* Show no data found only when initialized and no products */}
          {state.initialized && !isLoading && !Boolean(state.products.length) && (
            <>
              <Stack justifyContent="center" alignItems="center" sx={{ svg: { width: 300, height: 380 } }}>
                <NoDataFound className="svg" />
              </Stack>
            </>
          )}

          {/* Show loading or results */}
          {(isLoading || state.products.length > 0) && (
            <MenuList
              sx={{
                pt: 0,
                mt: 1,
                overflow: 'auto',
                px: 1,
                gap: 1,
                display: 'flex',

                flexDirection: 'column',
                li: {
                  borderRadius: '8px',
                  border: `1px solid transparent`,
                  '&:hover, &.Mui-focusVisible, &.Mui-selected ': {
                    border: (theme) => `1px solid ${theme.palette.primary.main}`,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                    h6: { color: 'primary.main' }
                  },
                  '&.active': {
                    border: (theme) => `1px solid ${theme.palette.primary.main}`,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                    h6: { color: 'primary.main' }
                  }
                }
              }}
              autoFocusItem={!focus}
            >
              {(isLoading
                ? Array.from(new Array(mobile ? 6 : 8)).map((_, index) => ({
                    _id: `skeleton-${index}`,
                    name: '',
                    category: '',
                    image: { url: '' },
                    salePrice: 0,
                    slug: ''
                  }))
                : state.products
              ).map((product) => (
                <MenuItem
                  key={product?._id}
                  className={Boolean(state.selected.filter((v) => v._id === product?._id)?.length) ? 'active' : ''}
                  onClick={() => {
                    if (!isLoading) handleListItemClick(multiSelect ? product : product?.slug);
                  }}
                >
                  <ListItemIcon>
                    {isLoading ? (
                      <Skeleton variant="circular" width={40} height={40} />
                    ) : (
                      <BlurImageAvatar
                        alt={product.name}
                        src={product.image?.url || ''}
                        priority
                        layout="fill"
                        objectFit="cover"
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText>
                    <Stack direction="row" gap={1} alignItems={'center'} justifyContent={'space-between'}>
                      <div>
                        <Typography variant="subtitle1" color="text.primary" noWrap>
                          {isLoading ? <Skeleton variant="text" width="200px" /> : product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {isLoading ? <Skeleton variant="text" width="200px" /> : product.category}
                        </Typography>
                      </div>
                      <Typography variant="subtitle1" color="text.primary" noWrap>
                        {isLoading ? (
                          <Skeleton variant="text" width="100px" />
                        ) : (
                          fCurrency(cCurrency(product.salePrice))
                        )}
                      </Typography>
                    </Stack>
                  </ListItemText>
                </MenuItem>
              ))}
            </MenuList>
          )}
        </Box>{' '}
        {multiSelect && (
          <Stack gap={1} direction={'row'} p={1} justifyContent={'end'}>
            <Button variant="outlined" color="primary" onClick={() => handleSave(selectedProducts)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleSave(state.selected)}>
              Save
            </Button>
          </Stack>
        )}
      </Box>
    </>
  );
}
