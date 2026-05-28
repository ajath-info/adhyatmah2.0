'use client';
import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

const features = [
    {
        icon: <img src="/images/Pandit.png" alt="Verified Pandits" />,
        label: 'Verified Pandits',
    },
    {
        icon: <img src="/images/Samagri.png" alt="100% Authentic Samagri" />,
        label: '100% Authentic Samagri',
    },
    {
        icon: <img src="/images/pooja.png" alt="Live Pooja Option" />,
        label: 'Live Puja Option',
    },
    {
        icon: <img src="/images/trusted.png" alt="Trusted by 10,000+ Devotees" />,
        label: 'Trusted by 10,000+ Devotees',
    },
];

export default function WhyChooseUs() {
    return (
        <Box sx={{
            py: { xs: 0, md: 1 },
            px: { xs: 2, md: 6 },
            background: 'transparent',
            textAlign: 'center',
        }}>

            {/* ── TOP HORIZONTAL LINE ── */}
            <Box sx={{ width: '100%', height: '1px', background: '#e0c9a6', mb: 3 }} />

            {/* ── TITLE ── */}
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ mb: 4 }}>
                <Box sx={{ width: 40, height: 1.5, background: '#fb8b05', borderRadius: 1 }} />
                <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 700, color: '#fb8b05' }}>
                    Why Choose Us?
                </Typography>
                <Box sx={{ width: 40, height: 1.5, background: '#fb8b05', borderRadius: 1 }} />
            </Stack>

            {/* ── GRID with vertical dividers ── */}
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
                divider={
                    <Box sx={{
                        width: '1px',
                        height: 110,
                        background: '#e0c9a6',
                        alignSelf: 'center',
                        flexShrink: 0,
                    }} />
                }
                sx={{
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                    gap: { xs: 3, md: 0 },
                }}
            >
                {features.map((item, i) => (
                    <Box
                        key={i}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1.5,
                            // Wider min-width = more breathing room between items
                            width: { xs: '42%', sm: 200, md: 220 },
                            px: { xs: 1, md: 4 },
                        }}
                    >
                        <Box sx={{
                            width: 120,
                            height: 120,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '& img': {
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }
                        }}>
                            {item.icon}
                        </Box>
                        <Typography sx={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: 'text.primary',
                            lineHeight: 1.4,
                            textAlign: 'center',
                        }}>
                            {item.label}
                        </Typography>
                    </Box>
                ))}
            </Stack>

            {/* ── BOTTOM HORIZONTAL LINE ── */}
            <Box sx={{ width: '100%', height: '1px', background: '#e0c9a6', mt: 3 }} />

        </Box>
    );
}