import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from '@bprogress/next';

// mui
import { styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip, Chip } from '@mui/material';

// components

import BlurImage from '@/components/blur-image';
import { fDateShort } from '@/utils/format-time';

// icons
import { IoEye } from 'react-icons/io5';
import { useCurrencyFormat } from '@/hooks/use-currency-format';

OrderList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isVendor: PropTypes.bool,
  row: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        cover: PropTypes.string,
        imageUrl: PropTypes.string,
        cover: PropTypes.string
      })
    ).isRequired,
    user: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.instanceOf(Date).isRequired,
    status: PropTypes.oneOf(['delivered', 'ontheway', 'pending']).isRequired,
    total: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired
  }).isRequired,
  isUser: PropTypes.bool.isRequired
};

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  objectFit: 'cover',
  border: '1px solid ' + theme.palette.divider,
  borderRadius: theme.shape.borderRadiusSm,
  position: 'relative',
  overflow: 'hidden'
}));
export default function OrderList({ isLoading, row, isUser, isVendor }) {
  // const theme = useTheme();
  const router = useRouter();
  const fCurrency = useCurrencyFormat('custom', row?.currency);
  return (
    <TableRow hover key={Math.random()}>
      <TableCell component="th" scope="row">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          {isLoading ? (
            <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <ThumbImgStyle>
              <BlurImage
                priority
                fill
                alt={row.items?.[0]?.name ?? 'No name'}
                src={row.items?.[0]?.cover ?? row.items?.[0]?.imageUrl ?? '/no-image.png'}
                objectFit="cover"
              />
            </ThumbImgStyle>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? (
              <Skeleton variant="text" width={120} sx={{ ml: 1 }} />
            ) : !isUser ? (
              row.user?.firstName && row.user?.lastName ? (
                `${row.user.firstName} ${row.user.lastName}`
              ) : (
                row.user?.firstName || row.user?.lastName || 'N/A'
              )
            ) : (
              row.items[0]?.name
            )}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : fCurrency(row.total)}</TableCell>
      <TableCell>
        {isLoading ? <Skeleton variant="text" /> : row.items.length + ' item' + (row.items.length > 1 ? 's' : '')}
      </TableCell>
      <TableCell>
        {isLoading ? <Skeleton variant="text" /> : row.paymentMethod === 'COD' ? 'Cash on delivery' : row.paymentMethod}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip
            size="small"
            label={row.status}
            color={
              (row?.status === 'delivered' && 'success') ||
              (row?.status === 'ontheway' && 'warning') ||
              (row?.status === 'pending' && 'info') ||
              'error'
            }
          />
        )}
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <> {fDateShort(row.createdAt)} </>}</TableCell>

      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
          ) : (
            <Tooltip title="Preview">
              <IconButton onClick={() => router.push(`/${isVendor ? 'vendor' : 'admin'}/orders/${row._id}`)}>
                <IoEye />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
