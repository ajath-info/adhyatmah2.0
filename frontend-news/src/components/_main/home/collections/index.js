'use client';
import React from 'react';

// mui
import { Typography, Container, Stack, Grid, Card, CardMedia, CardContent, CardActionArea, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Collections({ data, title, description }) {
  const router = useRouter();

  const handleCollectionClick = (collection) => {
    // Navigate to collection products page
    router.push(`/collections/${collection.handle}`);
  };

  return (
    <Container maxWidth="xl">
      <Stack gap={3}>
        <Stack>
          <Typography variant="h2" color="text.primary">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </Stack>

        {!Boolean(data.length) ? (
          <Typography variant="h3" color="error.main" textAlign="center">
            Collections not found
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {data.map((collection, index) => (
              <Grid item xs={12} sm={6} md={4} key={collection.id || index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleCollectionClick(collection)}
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={collection.image?.url || '/images/default-shop.png'}
                      alt={collection.image?.altText || collection.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        color="text.primary"
                        sx={{ 
                          fontWeight: 600,
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {collection.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          flexGrow: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {collection.description}
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                          {collection.products?.length || 0} products
                        </Typography>
                        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                          View All →
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
}
