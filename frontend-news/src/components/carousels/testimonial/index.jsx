'use client';
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { Box, Card, Stack, Typography, Rating, Avatar } from '@mui/material';
import { GoVerified } from 'react-icons/go';
import { FaFemale, FaMale, FaTransgender } from 'react-icons/fa';

export default function TestimonialCarousel({ data, onApi }) {
  // ✅ Correct order: [emblaRef, emblaApi]
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [activeIndex, setActiveIndex] = useState(0);

  // Hand Embla API up to parent
  useEffect(() => {
    if (onApi) onApi(emblaApi);
  }, [emblaApi, onApi]);

  // ✅ Track current slide index
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(); // set initial index
    emblaApi.on('select', onSelect); // update on scroll
  }, [emblaApi, onSelect]);

  // Nested slide component (no separate file)
  function Slide({ item }) {
    return (
      <Card
        sx={{
          p: 2,
          maxWidth: { xs: '100%', md: 500 },
          ml: 'auto',
          position: 'relative',
          overflow: 'visible'
        }}
      >
        <Stack spacing={1} alignItems="center" justifyContent="center" textAlign="center">
          {item.user?.cover?.url ? (
            <Image
              src={item.user.cover.url}
              alt="avatar"
              draggable={false}
              height={80}
              width={80}
              style={{ borderRadius: 50 }}
            />
          ) : (
            <Avatar sx={{ bgcolor: 'grey.200', width: 80, height: 80, fontSize: 40 }}>
  {item?.user?.gender === 'female' ? (
    <FaFemale color="#e91e63" />
  ) : item?.user?.gender === 'male' ? (
    <FaMale color="#2196f3" />
  ) : (
    <FaTransgender color="#9c27b0" />
  )}
</Avatar>
          )}

          <Typography variant="h6">{item.user?.firstName && item.user?.lastName ? `${item.user.firstName} ${item.user.lastName}` : item.user?.firstName || item.user?.lastName || 'Anonymous'}</Typography>
          {item.user?.city && item.user?.country && (
  <Typography variant="body1">
    {item.user.city}, {item.user.country}
  </Typography>
)}
          <Rating value={item.rating} readOnly size="small" />
          <Typography variant="body1">{item.review}</Typography>
        </Stack>
      </Card>
    );
  }

  Slide.propTypes = { item: PropTypes.object.isRequired };

  return (
    // Viewport with Embla ref
    <Box className="embla" sx={{ position: 'relative', overflow: 'hidden', height: '100%' }} ref={emblaRef}>
      {/* Track */}
      <Box className="embla__container" sx={{ display: 'flex' }}>
        {data?.map((item, index) => (
          <Box
            className="embla__slide"
            key={index}
            sx={{
              flex: '0 0 100%',
              minWidth: 0,
              px: 2,
              position: 'relative'
            }}
          >
            <Slide item={item} />
          </Box>
        ))}
      </Box>

      {/* Floating rating card – only show current active index */}
      {data?.[activeIndex] && (
        <Card
          sx={{
            display: { xs: 'none', md: 'flex' },
            bgcolor: 'primary.main',
            position: 'absolute',
            bottom: 80,
            left: 60,
            p: 2,
            color: 'common.white',
            minWidth: 210,
            zIndex: 99
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <GoVerified size={40} />
            <Stack spacing={0}>
              <Typography variant="subtitle2">{data[activeIndex].rating}/5</Typography>
              <Rating value={data[activeIndex].rating} readOnly size="small" />
              <Typography variant="subtitle2">{data[activeIndex].rating} Star Rating</Typography>
            </Stack>
          </Stack>
        </Card>
      )}
    </Box>
  );
}

TestimonialCarousel.propTypes = {
  data: PropTypes.array.isRequired,
  onApi: PropTypes.func // receives Embla API
};
