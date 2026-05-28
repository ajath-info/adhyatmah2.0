'use client';
import React from 'react';
import { useRouter } from '@bprogress/next';
import { Typography, Card, Box, Skeleton, Stack, Button } from '@mui/material';
import Image from '@/components/blur-image';
import { FiEye } from 'react-icons/fi';
import { MdAccessTime } from 'react-icons/md';

export default function PoojaCard({ service, isLoading, singleAction = false, actionLabel = 'View Details & Book', actionUrl = '' }) {
    const router = useRouter();
    const serviceName = service?.name || '';
    const serviceListingUrl = `/services/${service?.id}?name=${encodeURIComponent(serviceName)}`;
    const targetUrl = actionUrl || serviceListingUrl;
    const imageUrl = service?.image?.url || service?.imageUrl || service?.thumbnail || '';

    const views = service?.views >= 1000
        ? (service.views / 1000).toFixed(1) + 'K'
        : service?.views || '2.8K';

    const price = service?.price || 5100;
    const originalPrice = service?.originalPrice || Math.round(price * 1.13);

    return (
        <Card sx={{
            width: '100%',
            borderRadius: '22px',
            overflow: 'hidden',
            background: 'rgb(255, 247, 237)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.13)',
            border: 'none',
            transition: 'all .25s ease',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.18)'
            }
        }}>

            {/* ── IMAGE ── */}
            <Box sx={{ position: 'relative', width: '100%', height: 230, overflow: 'hidden' }}>
                {isLoading
                    ? <Skeleton variant="rectangular" width="100%" height={230} />
                    : (
                        <Box sx={{
                            width: '100%', height: '100%',
                            background: '#f0e0d0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {imageUrl
                                ? <Image
                                    alt={service?.name}
                                    src={imageUrl}
                                    fill
                                    style={{ objectFit: 'cover', display: 'block' }}
                                />
                                : <Typography sx={{ fontSize: 64 }}>🪔</Typography>
                            }
                        </Box>
                    )
                }
            </Box>

            {/* ── BODY ── */}
            <Box sx={{ px: '12px', pt: '10px', pb: '1px' }}>

                {/* TITLE + VIEWS BADGE */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography sx={{
                        fontSize: 20, fontWeight: 700, color: '#2d1a06', lineHeight: 1.3
                    }}>
                        {isLoading ? <Skeleton width={140} /> : service?.name || 'Pooja Service'}
                    </Typography>

                    {!isLoading && (
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{
                            background: '#fb8b05',
                            borderRadius: '20px',
                            px: 1.2, py: 0.5,
                            mr: 1,
                            flexShrink: 0
                        }}>
                            <FiEye size={14} color="#fff" />
                            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#fff', lineHeight: 1 }}>
                                {views}
                            </Typography>
                        </Stack>
                    )}
                </Stack>

                {/* PRICE + DURATION in same row */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: '14px' }}>
                    {isLoading
                        ? <Skeleton width={120} />
                        : (
                            <Stack direction="row" alignItems="baseline" spacing={1}>
                                <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a' }}>
                                    ₹{price.toLocaleString('en-IN')}
                                </Typography>
                                <Typography sx={{ fontSize: 13, color: '#aaa', textDecoration: 'line-through' }}>
                                    ₹{originalPrice.toLocaleString('en-IN')}
                                </Typography>
                            </Stack>
                        )
                    }

                    {!isLoading && (
                        <Stack direction="row" alignItems="center" spacing={0.6} sx={{
                            background: '#fff3e0',
                            border: '1.5px solid #fbc97a',
                            borderRadius: '20px',
                            px: 1.2, py: 0.4,
                            flexShrink: 0
                        }}>
                            <MdAccessTime size={13} color="#fb8b05" />
                            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#b86000', lineHeight: 1 }}>
                                {service?.duration || '3 – 4 hrs'}
                            </Typography>
                        </Stack>
                    )}
                </Stack>
            </Box>

            {/* ── BUTTONS ── */}
            <Stack direction="row" spacing={1.2} sx={{ px: '16px', pb: '16px', pt: '5px' }}>
                {isLoading
                    ? <Skeleton width="100%" height={46} sx={{ borderRadius: '50px' }} />
                    : singleAction
                        ? (
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => router.push(targetUrl)}
                                sx={{
                                    borderRadius: '50px',
                                    textTransform: 'none',
                                    background: '#fb8b05',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: 14,
                                    py: 1.2,
                                    boxShadow: 'none',
                                    '&:hover': {
                                        background: '#fb8b05',
                                        opacity: 0.85,
                                        boxShadow: 'none'
                                    }
                                }}
                            >
                                {actionLabel}
                            </Button>
                        )
                        : (
                            <>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => router.push(targetUrl)}
                                    sx={{
                                        borderRadius: '50px',
                                        textTransform: 'none',
                                        border: '2px solid #fb8b05',
                                        color: '#fb8b05',
                                        fontWeight: 700,
                                        fontSize: 14,
                                        py: 1.2,
                                        background: 'transparent',
                                        '&:hover': {
                                            border: '2px solid #fb8b05',
                                            background: 'rgba(212,118,58,0.07)',
                                            opacity: 0.85
                                        }
                                    }}
                                >
                                    View Details
                                </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => router.push(targetUrl)}
                                    sx={{
                                        borderRadius: '50px',
                                        textTransform: 'none',
                                        background: '#fb8b05',
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontSize: 14,
                                        py: 1.2,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            background: '#fb8b05',
                                            opacity: 0.85,
                                            boxShadow: 'none'
                                        }
                                    }}
                                >
                                    Book Now
                                </Button>
                            </>
                        )
                }
            </Stack>
        </Card>
    );
}