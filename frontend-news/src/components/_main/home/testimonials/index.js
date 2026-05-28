'use client';
import React from 'react';
import { alpha, Box, Grid, Typography, Container, Stack, Fab } from '@mui/material';
import { IoArrowForward, IoArrowBackOutline } from 'react-icons/io5';
import TestimonialCarousel from 'src/components/carousels/testimonial';
import { useSelector } from 'react-redux';

export default function Testimonials({ data }) {
  const { themeMode } = useSelector(({ settings }) => settings);
  const isDarkMode = themeMode === 'dark';

  // Hold Embla API from the child
  const emblaApiRef = React.useRef(null);
  const handlePrev = () => emblaApiRef.current?.scrollPrev();
  const handleNext = () => emblaApiRef.current?.scrollNext();

  return (
    <Box
      sx={{
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        py: 6
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid size={{ md: 6, xs: 12 }}>
            <Stack gap={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Typography
                variant="h3"
                mb={2}
                maxWidth={{ xs: '100%', md: 400 }}
                lineHeight={1.2}
                textAlign={{ xs: 'center', md: 'left' }}
              >
                Let's explore customer sentiments towards our offerings.
              </Typography>

              <Typography variant="body1" color="text.secondary" mb={2} maxWidth={{ xs: '100%', md: 550 }}>
                Discover what customers are saying about our products. Dive into the feedback on the quality and
                performance of our offerings. Gain insights into how our customers perceive our products and their
                overall satisfaction. Your opinions matter, and we're here to listen.
              </Typography>
            </Stack>

            {/* Controls in the parent */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={{ xs: 'center', md: 'start' }}
              spacing={3}
              mt={4}
            >
              <Fab
                color="primary"
                aria-label="back"
                size="small"
                onClick={handlePrev}
                sx={{
                  bgcolor: isDarkMode ? 'primary.main' : 'background.paper',
                  color: isDarkMode ? 'common.white' : 'primary.main',
                  zIndex: 99
                }}
              >
                <IoArrowBackOutline size={24} />
              </Fab>
              <Fab
                color="primary"
                aria-label="forward"
                size="small"
                onClick={handleNext}
                sx={{
                  bgcolor: isDarkMode ? 'primary.main' : 'background.paper',
                  color: isDarkMode ? 'common.white' : 'primary.main',
                  zIndex: 99
                }}
              >
                <IoArrowForward size={24} />
              </Fab>
            </Stack>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }}>
            <TestimonialCarousel
              data={data}
              onApi={(api) => {
                emblaApiRef.current = api; // receive Embla API from child
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
