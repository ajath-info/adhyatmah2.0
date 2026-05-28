'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
// mui
import useMediaQuery from '@mui/material/useMediaQuery';
import Skeleton from '@mui/material/Skeleton';

export default function BlurImage({ src, alt, width, height, fill, layout, static: isStatic, ...props }) {
  const isDesktop = useMediaQuery('(min-width:600px)');
  const [loading, setLoading] = React.useState(true);

  const useFillLayout = fill || layout === 'fill';

  return (
    <>
      {loading && (
        <Skeleton
          width={useFillLayout ? '100%' : width}
          height={useFillLayout ? '100%' : height}
          variant="rectangular"
          sx={{
            position: useFillLayout ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            ...(useFillLayout && { width: '100%', height: '100%' })
          }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={useFillLayout ? undefined : width}
        height={useFillLayout ? undefined : height}
        layout={useFillLayout ? 'fill' : undefined}
        onLoad={() => setLoading(false)}
        sizes={isDesktop ? '14vw' : '50vw'}
        {...props}
      />
    </>
  );
}

BlurImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number, // Required unless fill layout is used
  height: PropTypes.number, // Required unless fill layout is used
  fill: PropTypes.bool, // Indicates fill layout
  layout: PropTypes.string, // Allows custom layout prop for flexibility
  static: PropTypes.bool // Optional static prop (not used currently)
};
