'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useEmblaCarousel from 'embla-carousel-react';

import { Box, Paper, IconButton, useMediaQuery, Button, Stack } from '@mui/material';
import { IoArrowForward, IoArrowBackOutline } from 'react-icons/io5';

import ProductCard from 'src/components/cards/product';

function ProductsCarousel({ data, isLoading, query }) {
  const isLarge = useMediaQuery('(min-width:1200px)');
  const isDesktop = useMediaQuery('(min-width:900px)');
  const isTablet = useMediaQuery('(min-width:600px)');
  const isMobile = useMediaQuery('(max-width:600px)');

  const slidesToShow = isLarge ? 4 : isDesktop ? 3 : isTablet ? 2 : isMobile ? 2 : 4;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: slidesToShow
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const handleSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', handleSelect);
    handleSelect();
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const renderSlides = () =>
    (isLoading ? Array.from(new Array(slidesToShow)) : data).map((item, index) => (
      <Box
        key={index}
        sx={{
          flex: `0 0 ${100 / slidesToShow}%`,
          minWidth: 0,
          px: 1,
          pb: 1,
          boxSizing: 'border-box'
        }}
      >
        <ProductCard loading={isLoading} product={!isLoading ? item : null} />
      </Box>
    ));

  return (
    <Paper elevation={0} sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <Box
        ref={emblaRef}
        sx={{
          overflow: 'hidden',
          width: '100%'
        }}
      >
        <Box sx={{ display: 'flex' }}>{renderSlides()}</Box>
      </Box>

      <Stack direction="row" justifyContent={query ? 'space-between' : 'center'} alignItems="center" mt={3}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            position: 'relative'
          }}
        >
          {/* Left Arrow */}
          <IconButton
            size="small"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            sx={{
              minHeight: '32px',
              height: '32px',
              width: '32px',
              boxShadow: 'none'
            }}
          >
            <IoArrowBackOutline />
          </IconButton>

          {/* Dots */}
          {emblaApi?.scrollSnapList().map((_, index) => (
            <Box
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              sx={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                backgroundColor: emblaApi.selectedScrollSnap() === index ? 'primary.main' : 'grey.400',
                cursor: 'pointer'
              }}
            />
          ))}

          {/* Right Arrow */}
          <IconButton
            size="small"
            onClick={scrollNext}
            disabled={!canScrollNext}
            sx={{
              minHeight: '32px',
              height: '32px',
              width: '32px',
              boxShadow: 'none'
            }}
          >
            <IoArrowForward />
          </IconButton>
        </Box>
        {query && (
          <Button
            variant="outlined"
            color="secondary"
            endIcon={<IoArrowForward />}
            component={Link}
            href={`/products` + query}
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
        )}
        <Box></Box>
      </Stack>
    </Paper>
  );
}

ProductsCarousel.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default ProductsCarousel;
