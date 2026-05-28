'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from '@bprogress/next';
// mui
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Stack, 
  Typography, 
  Button, 
  Box,
  Chip,
  Skeleton 
} from '@mui/material';
// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
// hooks
import { useCurrencyFormat } from '@/hooks/use-currency-format';
import { useSelector } from '@/redux';

export default function ViewService({ params }) {
  const router = useRouter();
  const { id } = params;
  const { currency } = useSelector((state) => state.settings);
  const fCurrency = useCurrencyFormat('base');
  
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['vendor-service', id],
    queryFn: () => api.getServiceByVendor(id)
  });

  const service = data?.data;

  if (isLoading) {
    return (
      <div>
        <HeaderBreadcrumbs
          admin
          heading="View Pandit Service"
          links={[
            { name: 'Dashboard', href: '/vendor/dashboard' },
            { name: 'Pandit Services', href: '/vendor/services' },
            { name: 'View Service' }
          ]}
        />
        <Card>
          <CardHeader title={<Skeleton variant="text" width={200} />} />
          <CardContent>
            <Stack spacing={3}>
              <Skeleton variant="rectangular" height={56} />
              <Skeleton variant="rectangular" height={56} />
              <Skeleton variant="rectangular" height={56} />
              <Skeleton variant="rectangular" height={100} />
            </Stack>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="View Pandit Service"
        links={[
          {
            name: 'Dashboard',
            href: '/vendor/dashboard'
          },
          {
            name: 'Pandit Services',
            href: '/vendor/services'
          },
          {
            name: 'View Service'
          }
        ]}
        action={{
          href: `/vendor/services/${id}/edit`,
          title: 'Edit Service'
        }}
      />
      
      <Card>
        <CardHeader 
          title={service?.poojaType}
          subheader="Service Details"
        />
        <CardContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Service Information
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="subtitle2" sx={{ minWidth: 100 }}>
                    Pooja Type:
                  </Typography>
                  <Typography variant="body1">
                    {service?.poojaType}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="subtitle2" sx={{ minWidth: 100 }}>
                    Price:
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {fCurrency(service?.price, currency)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="subtitle2" sx={{ minWidth: 100 }}>
                    Duration:
                  </Typography>
                  <Chip 
                    label={service?.duration} 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="subtitle2" sx={{ minWidth: 100 }}>
                    Status:
                  </Typography>
                  <Chip 
                    label="Available" 
                    color="success" 
                    variant="filled"
                  />
                </Box>
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {service?.description}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => router.push('/vendor/services')}
              >
                Back to Services
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push(`/vendor/services/${id}/edit`)}
              >
                Edit Service
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
}

ViewService.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};
