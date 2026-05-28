'use client';
import React from 'react';
import PropTypes from 'prop-types';

// mui
import { Typography, Skeleton, Divider, Table, TableBody, TableRow, TableCell, Stack, Box } from '@mui/material';
import Link from '@/utils/link';
// components
import OrderDetailsTable from '../order-detail';

// custom hooks
import { useCurrencyFormat } from '@/hooks/use-currency-format';

// styled
import RootStyled from './styled';

TableCard.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.array.isRequired,
    totalItems: PropTypes.number.isRequired,
    subTotal: PropTypes.number.isRequired,
    shipping: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }).isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function TableCard({ ...props }) {
  const { data, isLoading } = props;
  const items = data?.items || [];
  const fCurrency = useCurrencyFormat('custom', data?.currency);
  const conversionRate = data?.conversionRate;

  const groupedItems = Object.values(
    (items || []).reduce((acc, item) => {
      const shopKey = item.shop;
      if (!acc[shopKey]) {
        acc[shopKey] = [];
      }
      acc[shopKey].push(item);
      return acc;
    }, {})
  );

  const courierInfo = data?.courierInfo || [];

  return (
    <RootStyled>
      {/* Order Summary Header */}
      {isLoading ? (
        <Skeleton variant="text" width={150} className="skeleton-h5" />
      ) : (
        <Typography variant="h5" p={2}>
          {data?.totalItems} {data?.totalItems > 1 ? 'Items' : 'Item'} in your order
        </Typography>
      )}

      {/* Grouped Items */}
      {(isLoading ? Array.from({ length: 1 }) : groupedItems)?.map((grp, i) => {
        const shopId = isLoading ? null : grp[0]?.shop;
        const matched = courierInfo.find((courier) => courier.shopId === shopId);

        return (
          <Stack gap={2} key={i} sx={{ p: 2, mb: 3 }}>
            {/* Product Table */}
            <OrderDetailsTable
              data={grp}
              isLoading={isLoading}
              conversionRate={conversionRate}
              currency={data?.currency}
            />

            {/* Courier Info */}
            {!isLoading && matched ? (
              <Box elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Shipping Information
                </Typography>
                <Typography variant="body2">
                  <strong>Courier:</strong> {matched.courierName}
                </Typography>
                <Typography variant="body2">
                  <strong>Tracking ID:</strong> {matched.trackingId}
                </Typography>
                <Typography variant="body2">
                  <strong>Tracking Link:</strong>{' '}
                  <Link variant="body2" href={matched.trackingLink} target="_blank" rel="noopener">
                    Track your package
                  </Link>
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Your delivery is being processed.
              </Typography>
            )}
          </Stack>
        );
      })}

      {/* Order Totals */}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ maxWidth: 500, ml: 'auto' }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{isLoading ? <Skeleton variant="text" width={100} /> : <strong>Subtotal</strong>}</TableCell>
              <TableCell align="right">
                {isLoading ? (
                  <Skeleton variant="text" width={100} />
                ) : (
                  <strong>{fCurrency(data?.subTotal * conversionRate)}</strong>
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{isLoading ? <Skeleton variant="text" width={100} /> : 'Shipping Fee'}</TableCell>
              <TableCell align="right">
                {isLoading ? <Skeleton variant="text" width={100} /> : fCurrency(data?.shipping * conversionRate)}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{isLoading ? <Skeleton variant="text" width={100} /> : 'Discount'}</TableCell>
              <TableCell align="right">
                {isLoading ? (
                  <Skeleton variant="text" width={100} />
                ) : (
                  <>-{fCurrency(data?.discount * conversionRate)}</>
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{isLoading ? <Skeleton variant="text" width={100} /> : <strong>Total</strong>}</TableCell>
              <TableCell align="right">
                {isLoading ? (
                  <Skeleton variant="text" width={100} />
                ) : (
                  <Typography variant="h6" fontWeight="bold">
                    {fCurrency(data?.total * conversionRate)}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </RootStyled>
  );
}
