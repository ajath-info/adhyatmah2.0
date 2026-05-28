'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// mui
import { Box, Card, Grid, Container, CardActionArea } from '@mui/material';

export default function Index({ banners }) {
  // Guard against undefined or empty banners
  if (!banners || (!banners.banner1 && !banners.banner2 && !banners.banner3)) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { md: 'block', xs: 'none' }
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          {banners.banner1 && banners.banner1.image && (
            <Grid size={{ lg: 4, md: 4, sm: 6, xs: 12 }} key={banners.banner1.image._id || 'banner1'}>
              <Card>
                <CardActionArea
                  {...(Boolean(banners.banner1.link) && {
                    component: Link,
                    href: banners.banner1.link
                  })}
                >
                  <Box sx={{ position: 'relative', height: 240 }}>
                    <Image
                      draggable="false"
                      src={banners.banner1.image?.url || '/images/placeholder.jpg'}
                      alt="banner"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          )}

          {banners.banner2 && banners.banner2.image && (
            <Grid size={{ lg: 4, md: 4, sm: 6, xs: 12 }} key={banners.banner2.image._id || 'banner2'}>
              <Card>
                <CardActionArea
                  {...(Boolean(banners.banner2.link) && {
                    component: Link,
                    href: banners.banner2.link
                  })}
                >
                  <Box sx={{ position: 'relative', height: 240 }}>
                    <Image
                      draggable="false"
                      src={banners.banner2.image?.url || '/images/placeholder.jpg'}
                      alt="banner"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          )}
          {banners.banner3 && banners.banner3.image && (
            <Grid size={{ lg: 4, md: 4, sm: 6, xs: 12 }} key={banners.banner3.image._id || 'banner3'}>
              <Card>
                <CardActionArea
                  {...(Boolean(banners.banner3.link) && {
                    component: Link,
                    href: banners.banner3.link
                  })}
                >
                  <Box sx={{ position: 'relative', height: 240 }}>
                    <Image
                      draggable="false"
                      src={banners.banner3.image?.url || '/images/placeholder.jpg'}
                      alt="banner"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
