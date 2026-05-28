'use client';
import { useRouter } from '@bprogress/next';
import { useDispatch } from 'react-redux';
import { removeCompareProduct } from 'src/redux/slices/compare';
import Image from 'next/image';

// mui
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Box,
  CircularProgress,
  Stack,
  Card,
  Rating,
  IconButton,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';

// icons
import { IoIosCloseCircle } from 'react-icons/io';

// custom hooks
import { useCurrencyConvert } from '@/hooks/use-currency';
import { useCurrencyFormat } from '@/hooks/use-currency-format';

// components
import NoDataFoundIllustration from '@/illustrations/data-not-found';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover, overflow: 'hidden' }
}));

const CompareTable = ({ data, isLoading }) => {
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormat();
  const dispatch = useDispatch();
  const router = useRouter();

  const onRemoveCompare = async (event, pid) => {
    event.stopPropagation();

    dispatch(removeCompareProduct(pid));
  };

  // Find a variable product to derive variant keys
  const variableProduct = data.find((product) => product.type === 'variable');

  // Extract variant keys (like ["color","size"])
  const variantKeys = variableProduct?.variants?.[0]?.variant?.split('/') || [];

  return isLoading ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mt={4} // top margin
    >
      <CircularProgress size={40} thickness={4} />
    </Box>
  ) : data.length ? (
    <TableContainer component={Card}>
      <Table
        sx={{
          borderCollapse: 'separate',
          '& td, & th': { border: 1, borderColor: (theme) => theme.palette.action.hover }
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {data.map((product) => (
              <TableCell
                key={product._id}
                align="left"
                sx={{ minWidth: 292, maxWidth: 292, cursor: 'pointer' }}
                onClick={() => router.push('/product/' + product.slug)}
              >
                <Stack sx={{ position: 'relative' }}>
                  <IconButton
                    onClick={(e) => onRemoveCompare(e, product._id)}
                    aria-label="Remove from compare"
                    sx={{ position: 'absolute', top: 0, right: 0, zIndex: 50 }}
                  >
                    <IoIosCloseCircle />
                  </IconButton>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: { md: 320, sm: 170, xs: 150 },
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <Image src={product.images[0].url} alt={product.name} fill style={{ objectFit: 'cover' }} />
                  </Box>

                  <Typography variant="subtitle1" sx={{ marginY: { md: 2, xs: 1 } }} noWrap>
                    {product.name}
                  </Typography>
                </Stack>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Price Row */}
          <StyledTableRow>
            <TableCell component="th" sx={{ fontWeight: 600, fontSize: 16 }}>
              Price
            </TableCell>
            {data.map((product) => (
              <TableCell key={product._id} align="left" sx={{ fontWeight: 600, fontSize: 16, color: 'primary.main' }}>
                {fCurrency(cCurrency(product.salePrice))}
              </TableCell>
            ))}
          </StyledTableRow>

          {/* Rating Row */}
          <StyledTableRow>
            <TableCell sx={{ fontWeight: 600, fontSize: 16 }} component="th">
              Customer Feedback
            </TableCell>
            {data.map((product) => (
              <TableCell key={product._id} align="left" sx={{ fontSize: 16, color: 'text.secondary' }}>
                <Stack direction="row" alignItems="center">
                  <Rating size="small" name="read-only" precision={0.5} value={product.averageRating} readOnly />(
                  {product.averageRating || 0})
                </Stack>
              </TableCell>
            ))}
          </StyledTableRow>

          {/* Stock Row */}
          <StyledTableRow>
            <TableCell component="th" sx={{ fontWeight: 600, fontSize: 16 }}>
              Available Stock
            </TableCell>
            {data.map((product) => (
              <TableCell key={product._id} align="left" sx={{ fontSize: 16, color: 'primary.main' }}>
                {product.stockQuantity}
              </TableCell>
            ))}
          </StyledTableRow>

          {/* ✅ Variant Rows */}
          {variantKeys.map((key, keyIndex) => (
            <StyledTableRow key={keyIndex}>
              <TableCell component="th" sx={{ fontWeight: 600, fontSize: 16 }}>
                {key}
              </TableCell>

              {data.map((product) => {
                const variantValuesByIndex = {};

                product?.variants?.forEach((variant) => {
                  const parts = variant?.name?.split('/') || [];
                  parts.forEach((val, idx) => {
                    if (!variantValuesByIndex[idx]) {
                      variantValuesByIndex[idx] = new Set();
                    }
                    variantValuesByIndex[idx].add(val);
                  });
                });

                if (!product?.variants?.length) {
                  return (
                    <TableCell key={`${product._id}-${keyIndex}`} align="left" sx={{ fontSize: 16 }}>
                      -
                    </TableCell>
                  );
                }

                return (
                  <TableCell key={`${product._id}-${keyIndex}`} align="left" sx={{ fontSize: 16 }}>
                    {[...(variantValuesByIndex[keyIndex] || [])].join(', ') || '-'}
                  </TableCell>
                );
              })}
            </StyledTableRow>
          ))}

          {/* Brand Row */}
          <StyledTableRow>
            <TableCell component="th" sx={{ fontWeight: 600, fontSize: 16 }}>
              Brand
            </TableCell>
            {data.map((product) => (
              <TableCell key={product._id} align="left" sx={{ fontSize: 16 }}>
                {product.brand?.name || '-'}
              </TableCell>
            ))}
          </StyledTableRow>

          {/* Shop Row */}
          <StyledTableRow>
            <TableCell component="th" sx={{ fontWeight: 600, fontSize: 16 }}>
              Shop
            </TableCell>
            {data.map((product) => (
              <TableCell key={product._id} align="left" sx={{ fontSize: 14 }}>
                {product.shop?.name || '-'}
              </TableCell>
            ))}
          </StyledTableRow>

          {/* Categories Row */}
          <StyledTableRow>
            <TableCell component="th" sx={{ fontWeight: 600, fontSize: 16 }}>
              Categories
            </TableCell>
            {data.map((product) => (
              <TableCell key={product._id} align="left" sx={{ fontSize: 16 }}>
                {`${product.category?.name || ''} > ${product.subCategory?.name || ''} > ${product.childCategory?.name || ''}`}
              </TableCell>
            ))}
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Grid container justifyContent="center" spacing={2} sx={{ mt: 3 }}>
      <Grid item xs={12}>
        <NoDataFoundIllustration />
      </Grid>
    </Grid>
  );
};

export default CompareTable;
