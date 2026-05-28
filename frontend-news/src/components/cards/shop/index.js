'use client';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from '@bprogress/next';
// mui
import { Typography, Card, Box, Skeleton, Stack, Button, CardContent, Divider, Rating } from '@mui/material';
// components
import Image from '@/components/blur-image';
// icons
import { AiOutlineShop } from 'react-icons/ai';

export default function ShopCard({ shop, isLoading }) {
  const router = useRouter();
  const baseUrl = '/shops/';

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        {/* Shop Logo */}
        <Box>
          {isLoading ? (
            <Skeleton variant="circular" sx={{ height: 70, width: 70, mx: 'auto' }} />
          ) : (
            <Box
              sx={{
                position: 'relative',
                height: 70,
                width: 70,
                minWidth: 70,
                borderRadius: '50%',
                bgcolor: 'background.paper',
                mx: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  height: 64,
                  width: 64,
                  minWidth: 64,
                  borderRadius: '50%',
                  img: { borderRadius: '50%' },
                  '&:after': { content: `""`, display: 'block', paddingBottom: '100%' }
                }}
              >
                <Image
                  alt="shop"
                  src={shop?.logo?.url}
                  layout="fill"
                  objectFit="cover"
                  draggable="false"
                  quality={5}
                  sizes={'50vw'}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Shop Name + Description */}
        <Stack spacing={1} alignItems={'center'} textAlign={'center'}>
          <Typography
            {...(!isLoading && { component: Link, href: baseUrl + shop?.slug })}
            color="text.primary"
            variant="h6"
          >
            {isLoading ? <Skeleton variant="text" width={100} /> : shop?.name}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body1"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2, // limit to 2 lines
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal'
            }}
          >
            {isLoading ? (
              <>
                <Skeleton variant="text" width={140} />
                <Skeleton variant="text" width={140} />{' '}
              </>
            ) : (
              shop?.description
            )}
          </Typography>
          {isLoading ? (
            <Skeleton variant="text" width={80} />
          ) : (
            <Rating value={shop?.rating || 0} precision={0.5} readOnly />
          )}
        </Stack>

        {/* View Store Button Only */}
        <Stack direction="row" justifyContent="center" mt={2}>
          {isLoading ? (
            <Skeleton variant="rectangular" width={121} height={32} sx={{ borderRadius: '24px' }} />
          ) : (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => router.push(baseUrl + shop?.slug)}
              startIcon={<AiOutlineShop />}
              sx={{ borderRadius: 6, fontWeight: 400, whiteSpace: 'nowrap', px: 2 }}
            >
              View Store
            </Button>
          )}
        </Stack>
      </CardContent>

      {/* Total Products */}
      <Divider />
      <CardContent sx={{ py: '16px !important' }}>
        <Stack direction="row" alignItems="center" justifyContent="center">
          <Stack alignItems="center">
            <Typography variant="subtitle2" color="text.secondary">
              {isLoading ? <Skeleton variant="text" width={50} /> : 'Total Products'}
            </Typography>
            <Typography variant="h5" color="text.primary">
              {isLoading ? <Skeleton variant="text" width={100} /> : shop?.products?.length}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

ShopCard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  shop: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    logo: PropTypes.shape({ url: PropTypes.string }),
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    products: PropTypes.array
  }).isRequired
};
