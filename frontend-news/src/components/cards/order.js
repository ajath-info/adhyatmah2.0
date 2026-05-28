import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useRouter } from '@bprogress/next';
// mui
import { Grid, Paper, Typography, Skeleton, Box, Stack, IconButton, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IoMdCart } from 'react-icons/io';

import { MdOutlineDateRange } from 'react-icons/md';
// components

import { fDateShort } from '@/utils/format-time';
// icons
import { IoEye } from 'react-icons/io5';
import { useTheme } from '@mui/material/styles';
const RootStyle = styled(Paper)(({ theme }) => ({
  padding: '10px 10px 10px 16px',
  marginBottom: '0.5rem',
  backgroundColor: theme.palette.background.paper,
  border: '1px solid ' + theme.palette.divider,
  borderRadius: 4,
  '& .name': { fontWeight: 600, color: theme.palette.info.main },
  '& .time svg': { width: 10, height: 10, '& path': { fill: theme.palette.text.primary } },
  '& .date': { fontSize: '0.75rem', fontWeight: 500 },
  '& .callander': { '& svg': { width: 10, height: 10 } },
  '& .time-slot': { fontWeight: 500, fontSize: '0.75rem' },
  '& .phone-container': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    marginTop: '20px',
    gap: '0.5rem',
    '& .phone': { color: theme.palette.text.secondary, fontWeight: 400, fontSize: 11 },
    '& .btn-phone': { fontSize: '1px' }
  }
}));

export default function OrderCard({ ...props }) {
  const { item, isLoading } = props;
  const theme = useTheme();

  const router = useRouter();

  return (
    <RootStyle
      sx={{
        borderLeft: `6px solid ${
          isLoading
            ? theme.palette.divider
            : theme.palette[
                (item?.status === 'delivered' && 'success') ||
                  (item?.status === 'ontheway' && 'warning') ||
                  (item?.status === 'pending' && 'info') ||
                  'error'
              ].main
        }`
      }}
      key={Math.random()}
    >
      <Grid container alignItems="center">
        <Grid size={{ md: 8, sm: 8, xs: 8 }}>
          <Stack spacing={0.5}>
            <Typography variant="h6" color="primary.main" noWrap onClick={() => router.push(`/order/${item._id}`)}>
              {isLoading ? <Skeleton variant="text" /> : capitalize(item?.items[0]?.name)}
            </Typography>

            <Stack spacing={1} direction="row" alignItems="center">
              {isLoading ? <Skeleton variant="circular" width={20} height={20} /> : <IoMdCart fontSize="small" />}
              <Typography className="time-slot">
                {isLoading ? (
                  <Skeleton variant="text" width={50} />
                ) : (
                  item.items.length + ` item${item.items.length > 1 ? 's' : ''}`
                )}
              </Typography>
              {isLoading ? (
                <Skeleton variant="circular" width={20} height={20} />
              ) : (
                <MdOutlineDateRange fontSize="small" />
              )}
              <Typography className="date">
                {isLoading ? <Skeleton variant="text" width={50} /> : fDateShort(item.createdAt)}
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid item size={4}>
          <Typography sx={{ textAlign: 'right', mb: 0.5 }} variant="body2"></Typography>
          <Box className="phone-container">
            {isLoading ? (
              <Skeleton variant="text" width={50} />
            ) : (
              <Chip
                size="small"
                label={item?.status}
                color={
                  (item?.status === 'delivered' && 'success') ||
                  (item?.status === 'ontheway' && 'warning') ||
                  (item?.status === 'pending' && 'info') ||
                  'error'
                }
              />
            )}
            {isLoading ? (
              <Skeleton variant="circular" width={40} height={40} />
            ) : (
              <IconButton aria-label="" onClick={() => router.push(`/order/${item._id}`)}>
                <IoEye />
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>
    </RootStyle>
  );
}
OrderCard.propTypes = { item: PropTypes.object, isLoading: PropTypes.bool };
