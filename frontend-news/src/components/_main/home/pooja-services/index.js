'use client';
import React from 'react';
import Link from 'next/link';
import { Typography, Grid, Stack, Button, Box, Container } from '@mui/material';
import { IoArrowForward } from 'react-icons/io5';
import PoojaCard from 'src/components/cards/service/PoojaCard';

export default function PoojaServicesSection({ services }) {
    return (
        <Container maxWidth="xl">
            <Stack gap={3}>
                <Stack>
                    <Typography variant="h4" color="text.primary">
                        Puja Services
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Book Authentic Puja Services For Every Occasion
                    </Typography>
                </Stack>

                <Grid container spacing={2}>
                    {services?.length > 0
                        ? services.slice(0, 4).map((service, i) => (
                            <Grid size={{ lg: 3, md: 4, sm: 6, xs: 12 }} key={'pooja-' + i}>
                                <PoojaCard service={service} isLoading={false} />
                            </Grid>
                        ))
                        : [...Array(4)].map((_, i) => (
                            <Grid size={{ lg: 3, md: 4, sm: 6, xs: 12 }} key={'pooja-skeleton-' + i}>
                                <PoojaCard isLoading={true} />
                            </Grid>
                        ))
                    }
                </Grid>

                <Box sx={{ textAlign: 'center' }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        endIcon={<IoArrowForward />}
                        component={Link}
                        href={'/online-puja-services'}
                        sx={{
                            '& svg': { transition: 'transform 0.3s ease' },
                            '&:hover': { svg: { transform: 'translateX(4px)' } }
                        }}
                    >
                        View All
                    </Button>
                </Box>
            </Stack>
        </Container>
    );
}