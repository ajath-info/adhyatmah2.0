import React from 'react';
import PropTypes from 'prop-types';
import { fCurrency } from '@/utils/format-number';
// mui
import { Box, Card, CardContent, Grid, Stack, Typography, Skeleton, Chip } from '@mui/material';
// components
ShopDetail.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
};
export default function ShopDetail({ data, isLoading }) {
  return (
    <Grid container spacing={2}>
      {data.map((v, i) => (
        <Grid key={i} size={{ md: 4, sm: 6, xs: 12 }}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack>
                  {/* lineHeight={1.7} */}
                  <Stack direction="row" gap={1} alignItems="center">
                    <Typography
                      variant="h4"
                      {...(v.isDoc && {
                        component: 'a',
                        href: v.url,
                        download: true,
                        target: '_blank'
                      })}
                      sx={{
                        textDecoration: v.isDoc ? 'underline' : 'none'
                      }}
                      color="text.primary"
                    >
                      {isLoading ? (
                        <Skeleton variant="text" width={80} />
                      ) : v.name === 'Total Income' || v.name === 'Total Commission' ? (
                        fCurrency(v.items)
                      ) : v.isDoc ? (
                        <span
                          style={{
                            fontSize: 18
                          }}
                        >
                          Download
                        </span>
                      ) : (
                        v.items
                      )}
                    </Typography>
                    {v.name === 'Last Month Income' ? (
                      isLoading ? (
                        <Skeleton variant="text" width={50} />
                      ) : (
                        <Chip size="small" label="Pending" color="success" />
                      )
                    ) : (
                      ''
                    )}
                  </Stack>

                  <Typography variant="subtitle1" color="text.secondary">
                    {isLoading ? <Skeleton variant="text" width={120} /> : v.name}
                  </Typography>
                </Stack>
                {isLoading ? (
                  <Skeleton variant="circular" width={56} height={56} />
                ) : (
                  <Box
                    sx={{
                      height: 56,
                      width: 56,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${v.color}`,
                      color: v.color
                    }}
                  >
                    {v.icon}
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
