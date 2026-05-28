import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

// mui
import { Card, CardContent, CardHeader, Divider, Box, Stack, Typography, Skeleton } from '@mui/material';
import BlurImage from '@/components/blur-image';
// components

import NoDataFoundIllustration from '@/illustrations/data-not-found';

AdminBestSelling.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  isVendor: PropTypes.bool
};

export default function AdminBestSelling({ ...props }) {
  const { data, loading, isVendor } = props;

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardHeader title={<>{loading ? <Skeleton variant="text" height={28} width={180} /> : 'Best Selling'}</>} />
        {data?.length < 1 ? (
          <NoDataFoundIllustration
            sx={{
              height: 300,
              width: 300
            }}
          />
        ) : (
          <CardContent>
            {(loading ? Array.from(new Array(5)) : data)?.map((value, index, array) => (
              <React.Fragment key={index}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} py={1}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {loading ? (
                      <Skeleton variant="rounded" width={64} height={64} />
                    ) : (
                      <Box
                        sx={{
                          position: 'relative',
                          height: 64,
                          width: 64,
                          borderRadius: '8px',
                          border: '1px solid rgba(145, 158, 171, 0.32)',
                          img: {
                            borderRadius: '8px'
                            // border: "1px solid rgba(145, 158, 171, 0.32)",
                          }
                        }}
                      >
                        <BlurImage priority src={value.images[0].url} alt="product" layout="fill" objectFit="cover" />
                      </Box>
                    )}
                    <Box>
                      <Typography
                        component={Link}
                        href={
                          loading
                            ? '/admin/products'
                            : isVendor
                              ? `/vendor/products/${value.slug}`
                              : `/admin/products/${value.slug}`
                        }
                        variant="subtitle1"
                        noWrap
                        color="text.primary"
                      >
                        {loading ? <Skeleton variant="text" width={160} /> : value.name.slice(0, 18)}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="text.secondary">
                        {loading ? <Skeleton variant="text" width={60} /> : <> {value.sold} sold</>}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
                {index !== array.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </CardContent>
        )}
      </Card>
    </>
  );
}
