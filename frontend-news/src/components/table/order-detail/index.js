'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
// mui
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  Box,
  Skeleton,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import BlurImage from '@/components/blur-image';

// custom hooks
import { useCurrencyFormat } from '@/hooks/use-currency-format';

// styled
import RootStyled from './styled';

TableDetails.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string.isRequired
        })
      ).isRequired,
      color: PropTypes.string,
      size: PropTypes.string,
      quantity: PropTypes.number,
      salePrice: PropTypes.number,
      price: PropTypes.number
    })
  ).isRequired,
  currency: PropTypes.string,
  conversionRate: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
  currency: PropTypes.string.isRequired
};

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid' + theme.palette.divider,
  position: 'relative',
  overflow: 'hidden'
}));
export default function TableDetails({ ...props }) {
  const { data, isLoading, conversionRate, currency } = props;
  const fCurrency = useCurrencyFormat('custom', currency);

  const sortedProducts = (data || []).sort((a, b) =>
    a.deliveryType === 'physical' && b.deliveryType !== 'physical'
      ? 1
      : a.deliveryType !== 'physical' && b.deliveryType === 'physical'
        ? -1
        : 0
  );

  // Decide rows once
  const rows = isLoading ? Array.from({ length: 3 }) : sortedProducts;

  return (
    <RootStyled>
      <TableContainer>
        <Table className="table-main">
          <TableHead>
            <TableRow className="head-row">
              <TableCell className="head-row-cell">Product</TableCell>
              <TableCell className="head-row-cell">Delivery Type</TableCell>
              <TableCell className="head-row-cell">Download Link</TableCell>
              <TableCell className="head-row-cell">Quantity</TableCell>
              <TableCell className="head-row-cell" align="right">
                Price
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={`row-${i}`}>
                {/* Product */}
                <TableCell>
                  {isLoading ? (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Skeleton variant="rounded" width={64} height={64} />
                      <Skeleton variant="text" width={100} />
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <ThumbImgStyle
                        {...(row.slug && {
                          component: Link,
                          href: row.slug
                        })}
                      >
                        <BlurImage priority fill alt={row?.name} src={row?.imageUrl} objectFit="cover" />
                      </ThumbImgStyle>
                      <Stack spacing={0.5}>
                        <Typography
                          color="primary.main"
                          variant={'subtitle1'}
                          noWrap
                          fontWeight={600}
                          {...(row.slug && {
                            component: Link,
                            href: row.slug
                          })}
                        >
                          {row?.name}
                        </Typography>
                        <Stack spacing={1} direction="row" alignItems="center">
                          {row.type === 'simple' || !row.variantName
                            ? null
                            : row.variantName.split('/').map((item, idx) => (
                                <Typography key={idx} variant="body2" sx={{ span: { textTransform: 'uppercase' } }}>
                                  <b>{item}:</b> <span>{row.variant?.split('/')?.[idx] || '-'}</span>
                                </Typography>
                              ))}
                        </Stack>
                      </Stack>
                    </Stack>
                  )}
                </TableCell>

                {/* Delivery Type */}
                <TableCell sx={{ textTransform: 'capitalize' }}>
                  {isLoading ? <Skeleton variant="text" width={100} /> : row?.deliveryType}
                </TableCell>

                {/* Download Link */}
                <TableCell
                  {...(!isLoading &&
                    row?.deliveryType === 'digital' && {
                      component: Link,
                      href: row.slug,
                      sx: { color: 'primary.main' }
                    })}
                  target="_blank"
                >
                  {isLoading ? (
                    <Skeleton variant="text" width={100} />
                  ) : row?.deliveryType === 'digital' ? (
                    'Download'
                  ) : (
                    '-'
                  )}
                </TableCell>

                {/* Quantity */}
                <TableCell>{isLoading ? <Skeleton variant="text" width={100} /> : row?.quantity}</TableCell>

                {/* Price */}
                <TableCell align="right">
                  {isLoading ? (
                    <Skeleton variant="text" width={100} />
                  ) : (
                    fCurrency((row?.salePrice || row?.price) * conversionRate)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </RootStyled>
  );
}
