'use client';
import React from 'react';

// next
import Link from 'next/link';
import PropTypes from 'prop-types';

// mui
import { Card, Typography, CardActionArea, Stack, Skeleton, Box } from '@mui/material';

// components
import BlurImage from '@/components/blur-image';

export default function UserBrandsCard({ item, isLoading }) {
  return (
    <Card
      className="slider-main"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        position: 'relative',
        img: { borderRadius: '8px', objectFit: 'contain' }
      }}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, width: '100%' }}>
          <Skeleton variant="circular" width={70} height={70} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" height={24} width="80%" />
            <Skeleton variant="text" height={20} width="50%" />
          </Box>
        </Box>
      ) : (
        <CardActionArea component={Link} href={`/brands/${item?.slug}`} sx={{ p: 1, pr: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <BlurImage
              src={item?.logo?.url}
              alt="brand logo"
              width={70}
              height={70}
              draggable="false"
              objectFit="cover"
            />
            <Stack sx={{ display: 'grid' }}>
              <Typography variant="subtitle1" color="text.primary" noWrap>
                {item?.name}
              </Typography>
              <Typography variant="body1" noWrap>
                {item?.totalProducts + ' ' + (item?.totalProducts <= 1 ? 'Product' : 'Products')}
              </Typography>
            </Stack>
          </Stack>
        </CardActionArea>
      )}
    </Card>
  );
}

UserBrandsCard.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
    logo: PropTypes.shape({
      url: PropTypes.string
    }),
    createdAt: PropTypes.string,
    status: PropTypes.string,
    slug: PropTypes.string,
    totalProducts: PropTypes.number
  }),
  isLoading: PropTypes.bool,
  handleClickOpen: PropTypes.func
};
