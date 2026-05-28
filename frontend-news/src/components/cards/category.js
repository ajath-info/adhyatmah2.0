'use client';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Typography, Card, CardActionArea, Box, Stack } from '@mui/material';
import Image from '@/components/blur-image';

export default function CategoryCard({ category, slug, variant = 'square' }) {
  const baseUrl = '/products/' + (slug ? slug + '/' : '');

  // ✅ CIRCLE — homepage par
  if (variant === 'circle') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          component={Link}
          href={`${baseUrl}${category?.slug}`}
          sx={{
            borderRadius: '50%',
            overflow: 'hidden',
            width: { xs: 150, sm: 200 },
            height: { xs: 150, sm: 200 },
            border: '2.5px solid #e8d5b7',
            flexShrink: 0,
            display: 'block',
            position: 'relative',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'scale(1.07)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            },
          }}
        >
          <Image
            alt={category?.name}
            src={category?.cover?.url}
            layout="fill"
            objectFit="cover"
            draggable="false"
            quality={10}
            sizes="200px"
          />
        </Box>

        <Typography
          component={Link}
          href={`${baseUrl}${category?.slug}`}
          sx={{
            textAlign: 'center',
            fontWeight: 600,
            fontSize: { xs: 12, sm: 13 },
            color: 'text.primary',
            textDecoration: 'none',
            maxWidth: 160,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {category?.name}
        </Typography>
      </Box>
    );
  }
  // ✅ SQUARE — products page par (default)
  return (
    <Card
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        width: '100%',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardActionArea component={Link} href={`${baseUrl}${category?.slug}`}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 3',
            '& .image-wrapper': {
              position: 'absolute',
              inset: 0,
              img: { borderRadius: 0 },
            },
          }}
        >
          <Box className="image-wrapper">
            <Image
              alt={category?.name}
              src={category?.cover?.url}
              layout="fill"
              objectFit="cover"
              draggable="false"
              quality={10}
              sizes="(max-width: 600px) 50vw, 25vw"
            />
          </Box>
        </Box>
      </CardActionArea>

      <Stack spacing={1} sx={{ p: 1.5 }}>
        <Typography
          component={Link}
          href={`${baseUrl}${category?.slug}`}
          color="text.primary"
          variant="subtitle2"
          sx={{
            textTransform: 'capitalize',
            fontWeight: 700,
            fontSize: { sm: 14, xs: 12 },
            textDecoration: 'none',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '40px',
          }}
        >
          {category?.name}
        </Typography>
      </Stack>
    </Card>
  );
}

CategoryCard.propTypes = {
  category: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    cover: PropTypes.shape({
      url: PropTypes.string.isRequired,
      blurDataURL: PropTypes.string,
    }),
    name: PropTypes.string.isRequired,
  }).isRequired,
  slug: PropTypes.string,
  variant: PropTypes.oneOf(['circle', 'square']),
};