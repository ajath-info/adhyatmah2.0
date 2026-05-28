import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from '@bprogress/next';

// mui
import { Box, TableRow, Skeleton, TableCell, Stack, IconButton, Tooltip, Typography, Chip } from '@mui/material';

// components

import BlurImage from '@/components/blur-image';

// utils
import { fCurrency } from '@/utils/format-number';
import { fDateShort } from '@/utils/format-time';

// icons
import { MdEdit } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';

IncomeList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
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
    date: PropTypes.instanceOf(Date).isRequired,
    status: PropTypes.oneOf(['delivered', 'ontheway', 'pending']).isRequired,
    total: PropTypes.number.isRequired,
    shop: PropTypes.object.isRequired,
    orders: PropTypes.array.isRequired,
    totalIncome: PropTypes.number.isRequired,
    totalCommission: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    thisMonth: PropTypes.bool,
    _id: PropTypes.string.isRequired
  }).isRequired,
  handleClickOpen: PropTypes.func,
  isPayout: PropTypes.bool,
  isVendor: PropTypes.bool
};

export default function IncomeList({ isLoading, row, handleClickOpen, isPayout, isVendor }) {
  const router = useRouter();
  return (
    <TableRow hover key={Math.random()}>
      {isPayout ? (
        <TableCell component="th" scope="row" sx={{ maxWidth: 300 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {isLoading ? (
              <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} />
            ) : (
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  width: 50,
                  height: 50,
                  bgcolor: 'background.default',
                  mr: 2,
                  border: (theme) => '1px solid ' + theme.palette.divider,
                  borderRadius: '6px',
                  img: {
                    borderRadius: '2px'
                  }
                }}
              >
                <BlurImage alt={row?.name} src={row?.shop?.logo?.url} layout="fill" objectFit="cover" />
              </Box>
            )}
            <Typography variant="subtitle2" noWrap>
              {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.shop?.name}
            </Typography>
          </Box>
        </TableCell>
      ) : null}
      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.orders?.length || 0}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fCurrency(row.total || 0)}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fCurrency(row.totalIncome)}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fCurrency(row.totalCommission)}</TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip
            size="small"
            label={row.status}
            color={
              (row?.status === 'paid' && 'success') ||
              (row?.status === 'hold' && 'error') ||
              (row?.status === 'pending' && 'info') ||
              'error'
            }
          />
        )}
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{fDateShort(row.date).slice(3)}</>}</TableCell>

      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
          ) : row?.thisMonth ? null : (
            !isVendor && (
              <Tooltip title="Edit">
                <IconButton onClick={() => handleClickOpen(row)}>
                  <MdEdit />
                </IconButton>
              </Tooltip>
            )
          )}
          {isLoading ? (
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
          ) : row?._id ? (
            <Tooltip title="Preview">
              <IconButton onClick={() => router.push(`/${isVendor ? 'vendor' : 'admin'}/payments/${row._id}`)}>
                <IoEye />
              </IconButton>
            </Tooltip>
          ) : null}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
