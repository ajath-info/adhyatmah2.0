'use client';

import React, { useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';

import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import VendorCard from 'src/components/cards/vendor';
import * as api from 'src/services';

export default function PoojaServicePanditsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const serviceId = params.serviceId;
  const serviceName = searchParams.get('name') || '';

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['get-vendors'],
    queryFn: () => api.getAllPandit()
  });

  const vendors = data?.payload?.vendors || [];

  const filteredVendors = useMemo(() => {
    const normalizedQueryName = serviceName.trim().toLowerCase();

    return vendors.filter((vendor) =>
      (vendor?.services || []).some((svc) => {
        const svcId = String(svc?.id || svc?._id || '');
        const matchesId = svcId && svcId === String(serviceId);

        const svcName = String(svc?.poojaType || svc?.name || '').toLowerCase();
        const matchesName = normalizedQueryName && svcName.includes(normalizedQueryName);

        return matchesId || matchesName;
      })
    );
  }, [vendors, serviceId, serviceName]);

  const resolveMatchedService = (vendor) => {
    const normalizedQueryName = serviceName.trim().toLowerCase();
    return (vendor?.services || []).find((svc) => {
      const svcId = String(svc?.id || svc?._id || '');
      const matchesId = svcId && svcId === String(serviceId);

      const svcName = String(svc?.poojaType || svc?.name || '').toLowerCase();
      const matchesName = normalizedQueryName && svcName.includes(normalizedQueryName);

      return matchesId || matchesName;
    });
  };

  return (
    <Container maxWidth="xl">
      <Stack sx={{ gap: 3 }}>
        <HeaderBreadcrumbs
          heading={serviceName ? `${serviceName} Pandits` : 'Pooja Service Pandits'}
          links={[
            { name: 'Home', href: '/' },
            { name: 'Pooja Services', href: '/services' },
            { name: serviceName || 'Service' }
          ]}
        />

        <Box>
          <Grid container spacing={2} justifyContent="start" alignItems="center" mb={3}>
          {(isLoading ? Array.from(new Array(12)) : filteredVendors).map((vendor, index) => {
  const matchedService = !isLoading && vendor ? resolveMatchedService(vendor) : null;
  const vendorServiceId = matchedService?.id || matchedService?._id;
  const bookingHref =
    !isLoading && vendor
      ? (vendorServiceId ? `/vendors/${vendor.id}/services/${vendorServiceId}` : `/vendors/${vendor.id}`)
      : undefined;

  return (
    <React.Fragment key={vendor?.id || index}>
      <Grid size={{ lg: 3, md: 6, sm: 6, xs: 12 }}>
        <VendorCard
          vendor={vendor}
          isLoading={isLoading}
          singleActionButton
          singleActionLabel="View Details & Book"
          singleActionHref={bookingHref}
        />
      </Grid>
    </React.Fragment>
  );
})}
          </Grid>

          {!isLoading && !Boolean(filteredVendors.length) && (
            <Typography variant="h3" color="error.main" mb={3} textAlign="center">
              No Pandits found for this pooja service
            </Typography>
          )}
        </Box>
      </Stack>
    </Container>
  );
}
