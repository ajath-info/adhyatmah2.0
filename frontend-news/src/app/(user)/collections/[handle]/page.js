import React from 'react';

// mui
import { Box, Container, Stack, Typography, Grid, Card, CardMedia, CardContent, CardActionArea } from '@mui/material';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import ProductList from '@/components/_main/products';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({ params }) {
  const { handle } = await params;
  
  try {
    const res = await fetch(`${baseUrl}/api/getHomepageCollections?limit=100`, {
      next: { revalidate: 60 }
    });
    const collections = await res.json();
    
    const collection = collections?.payload?.collections?.find(c => c.handle === handle);
    
    if (!collection) {
      return {
        title: 'Collection Not Found',
        description: 'The requested collection could not be found.'
      };
    }
    
    return {
      title: `${collection.title} - Adhyatmah`,
      description: collection.description || `Browse our ${collection.title} collection`,
      openGraph: {
        title: `${collection.title} - Adhyatmah`,
        description: collection.description || `Browse our ${collection.title} collection`,
        images: collection.image?.url ? [{ url: collection.image.url }] : []
      }
    };
  } catch (error) {
    return {
      title: 'Collection - Adhyatmah',
      description: 'Browse our collection of products'
    };
  }
}

export default async function CollectionPage({ params }) {
  const { handle } = await params;
  
  try {
    const res = await fetch(`${baseUrl}/api/getHomepageCollections?limit=100`, {
      next: { revalidate: 60 }
    });
    const collections = await res.json();
    
    const collection = collections?.payload?.collections?.find(c => c.handle === handle);
    
    if (!collection) {
      return (
        <Box>
          <Container maxWidth="xl">
            <HeaderBreadcrumbs
              heading="Collection Not Found"
              links={[
                { name: 'Home', href: '/' },
                { name: 'Collections', href: '/collections' },
                { name: 'Not Found' }
              ]}
            />
            <Typography variant="h3" color="error.main" textAlign="center" sx={{ mt: 4 }}>
              Collection not found
            </Typography>
          </Container>
        </Box>
      );
    }
    
    return (
      <Box>
        <Container maxWidth="xl">
          <Stack gap={3}>
            <HeaderBreadcrumbs
              heading={collection.title}
              links={[
                { name: 'Home', href: '/' },
                { name: 'Collections', href: '/collections' },
                { name: collection.title }
              ]}
            />
            
            {/* Collection Header */}
            <Box sx={{ textAlign: 'center', py: 4 }}>
              {collection.image?.url && (
                <Box sx={{ mb: 3 }}>
                  <img 
                    src={collection.image.url} 
                    alt={collection.image.altText || collection.title}
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto', 
                      maxHeight: '300px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              )}
              <Typography variant="h2" color="text.primary" sx={{ mb: 2 }}>
                {collection.title}
              </Typography>
              {collection.description && (
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                  {collection.description}
                </Typography>
              )}
            </Box>
            
            {/* Products */}
            {collection.products && collection.products.length > 0 ? (
              <ProductList 
                title={`${collection.title} Products`}
                description={`Browse all products in our ${collection.title} collection`}
                data={collection.products}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h4" color="text.secondary">
                  No products available in this collection yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Check back soon for new additions to this collection
                </Typography>
              </Box>
            )}
          </Stack>
        </Container>
      </Box>
    );
  } catch (error) {
    return (
      <Box>
        <Container maxWidth="xl">
          <HeaderBreadcrumbs
            heading="Error"
            links={[
              { name: 'Home', href: '/' },
              { name: 'Collections', href: '/collections' },
              { name: 'Error' }
            ]}
          />
          <Typography variant="h3" color="error.main" textAlign="center" sx={{ mt: 4 }}>
            Error loading collection
          </Typography>
        </Container>
      </Box>
    );
  }
}
