'use client';

import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import {
  Box,
  Card,
  Stack,
  Typography,
  LinearProgress,
  IconButton
} from '@mui/material';

import { IoArrowBack, IoArrowForward } from 'react-icons/io5';

const AUTOPLAY_DELAY = 5000;

/* ------------------------------------------------------------------ */
/* Carousel Item */
/* ------------------------------------------------------------------ */
function CarouselItem({ item }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 125, sm: 225, md: 300, lg: 600 },
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        display: 'block'
      }}
      {...(item?.link && {
        component: Link,
        href: item.link
      })}
    >
      <Image
        priority
        src={item.image.url}
        alt="banner"
        fill
        draggable={false}
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
    </Box>
  );
}

CarouselItem.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.shape({
      url: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired
    }).isRequired,
    link: PropTypes.string
  }).isRequired
};

/* ------------------------------------------------------------------ */
/* Main Carousel */
/* ------------------------------------------------------------------ */
export default function SingleSlideCarousel({ data }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const isEmpty = !data || data.length === 0;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
    setProgress(0);

    const autoplay = emblaApi.plugins()?.autoplay;
    autoplay?.reset();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  /* Progress animation */
  useEffect(() => {
    let raf;
    const start = Date.now();

    const update = () => {
      const elapsed = Date.now() - start;
      const value = Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100);
      setProgress(value);
      if (value < 100) raf = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(raf);
  }, [selectedIndex]);

  return (
    <Card
      sx={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 0,
        height: { xs: 125, sm: 225, md: 300, lg: 600 }
      }}
    >
      {isEmpty ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            height: '100%'
          }}
        >
          <Typography variant="h4" color="text.secondary">
            Slides are not uploaded yet!
          </Typography>
        </Stack>
      ) : (
        <>
          {/* Embla viewport */}
          <Box ref={emblaRef} sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', height: '100%' }}>
              {data.map((item) => (
                <Box
                  key={item.image._id}
                  sx={{
                    flex: '0 0 100%',
                    minWidth: 0,
                    position: 'relative'
                  }}
                >
                  <CarouselItem item={item} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Left Arrow */}
          <IconButton
            onClick={() => emblaApi?.scrollPrev()}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              bgcolor: 'rgba(0,0,0,0.4)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <IoArrowBack size={22} />
          </IconButton>

          {/* Right Arrow */}
          <IconButton
            onClick={() => emblaApi?.scrollNext()}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              bgcolor: 'rgba(0,0,0,0.4)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <IoArrowForward size={22} />
          </IconButton>

          {/* Progress bar */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              width: '100%',
              height: 4,
              position: 'absolute',
              bottom: 0,
              left: 0,
              '& .MuiLinearProgress-bar': {
                transition: 'none'
              }
            }}
          />
        </>
      )}
    </Card>
  );
}

SingleSlideCarousel.propTypes = {
  data: PropTypes.array.isRequired
};