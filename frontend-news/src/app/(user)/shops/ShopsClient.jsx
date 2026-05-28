'use client';

import React from 'react';

// mui
import {
  Typography,
  Grid,
  Box,
  Stack,
  Container
} from '@mui/material';

// components
import VendorCard from 'src/components/cards/vendor';

// api
import * as api from 'src/services';

import { useQuery } from '@tanstack/react-query';

import HeaderBreadcrumbs
  from '@/components/header-breadcrumbs';


export default function ShopsClient() {

  const {
    data,
    isPending: isLoading
  } = useQuery({
    queryKey: ['get-vendors'],
    queryFn: () => api.getAllPandit()
  });

  const vendors =
    data?.payload?.vendors || [];

  return (

    <Container maxWidth="xl">

      <Stack
        sx={{
          gap: 3
        }}
      >

        <HeaderBreadcrumbs
          heading="Pandits"
          links={[
            {
              name: 'Home',
              href: '/'
            },
            {
              name: 'Pandits'
            }
          ]}
        />

        <Box>

          <Grid
            container
            spacing={2}
            justifyContent="start"
            alignItems="center"
            mb={3}
          >

            {(isLoading
              ? Array.from(new Array(12))
              : vendors
            ).map((vendor, index) => (

              <React.Fragment
                key={vendor?.id || index}
              >

                <Grid
                  size={{
                    lg: 3,
                    md: 6,
                    sm: 6,
                    xs: 12
                  }}
                >

                  <VendorCard
                    vendor={vendor}
                    isLoading={isLoading}
                  />

                </Grid>

              </React.Fragment>

            ))}

          </Grid>

          {!isLoading &&
            !Boolean(vendors.length) && (

            <Typography
              variant="h3"
              color="error.main"
              mb={3}
              textAlign="center"
            >
              No Pandits found
            </Typography>

          )}

        </Box>

      </Stack>

    </Container>
  );
}