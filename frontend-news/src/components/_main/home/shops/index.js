'use client';
// react
import React from 'react';
import Link from 'next/link';

// mui
import { Typography, Grid, Stack, Button, Box, Container } from '@mui/material';
// icons
import { IoArrowForward } from 'react-icons/io5';
// component
import VendorCard from 'src/components/cards/vendor';

export default function VendorComponent({ data }) {
	//console.log("HOME DATA FIRST ITEM:", data?.[0]);
  return (
    <Container maxWidth="xl">
      <Stack gap={3}>
        <Stack>
          <Typography variant="h4" color="text.primary">
            Pandit Ji List
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Our Highest Rated Pandits Where You Can Find Authentic Puja Services
          </Typography>
        </Stack>
        <Grid container spacing={2} justifyContent="left" alignItems="center">
          {data.slice(0, 4).map((vendor, i) => (
            <Grid size={{ lg: 3, md: 4, sm: 6, xs: 12 }} key={'vendor-' + i}>
              <VendorCard vendor={vendor} isLoading={false} />
            </Grid>
          ))}
          {!Boolean(data?.length) && (
            <Typography variant="h3" color="error.main" textAlign="center">
              No Pandits found
            </Typography>
          )}
        </Grid>
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            color="secondary"
            endIcon={<IoArrowForward />}
            component={Link}
            href={'/book-pandit-online'}
            sx={{
              '& svg': {
                transition: 'transform 0.3s ease' // smooth effect
              },
              '&:hover': {
                svg: { transform: 'translateX(4px)' }
              }
            }}
          >
            View All
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
