import React from 'react';
// MUI
import { IconButton, Stack, Radio } from '@mui/material';
import { alpha } from '@mui/material/styles';
// Icons
import { IoArrowBack, IoArrowForwardOutline } from 'react-icons/io5';
export default function Actions({ active, swiperRef, data }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      sx={{
        p: 0.5,
        bgcolor: (theme) => alpha(theme.palette.background.paper, 0.5),
        backdropFilter: 'blur(3px)',
        zIndex: 11,
        borderRadius: '27px',
        position: 'absolute',
        left: '50%',
        bottom: '10px',
        transform: 'translateX(-50%)',
        display: { md: 'flex', xs: 'none' }
      }}
    >
      {/* Previous Slide Button */}
      <IconButton
        size="small"
        aria-label="back"
        onClick={() => swiperRef.current?.slidePrev()}
        sx={{ width: 30, height: 30 }}
      >
        <IoArrowBack />
      </IconButton>

      {/* Pagination Dots */}
      {data.map((_, i) => (
        <Radio
          key={i}
          size="small"
          checked={i === active}
          onClick={() => swiperRef.current?.slideToLoop(i)}
          sx={{ width: 20, height: 20, p: 0.1 }}
        />
      ))}

      {/* Next Slide Button */}
      <IconButton
        size="small"
        aria-label="forward"
        onClick={() => swiperRef.current?.slideNext()}
        sx={{ width: 30, height: 30 }}
      >
        <IoArrowForwardOutline />
      </IconButton>
    </Stack>
  );
}
