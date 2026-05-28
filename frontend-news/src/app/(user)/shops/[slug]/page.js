// mui
import { Box, Container } from '@mui/material';
import { notFound } from 'next/navigation';

// components
import ProductList from 'src/components/_main/products';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function generateStaticParams() {
  try {
    if (!baseUrl) return [];
    const res = await fetch(`${baseUrl}/api/shops-slugs`, {
      next: { revalidate: 3600 } // Cache slug list for 1 hour
    });

    if (!res.ok) return [];

    const { data } = await res.json();

    return data?.map((cat) => ({ slug: cat.slug })) || [];
  } catch (err) {
    // If the API is unreachable at build time, return empty list to avoid crashing the build
    // Pages will be generated at runtime (fallback) or handled by client-side navigation.
    // eslint-disable-next-line no-console
    console.warn('generateStaticParams: failed to fetch shops-slugs', err);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    if (!baseUrl) return {};
    const res = await fetch(`${baseUrl}/api/shops/${slug}`, {
      cache: 'force-cache' // Prefer cached
    });

    if (!res.ok) return {};

    const { data: currentShop } = await res.json();

    if (!currentShop) return {};

    return {
      title: currentShop.metaTitle,
      description: currentShop.metaDescription,
      openGraph: {
        title: currentShop.name,
        description: currentShop.metaDescription
      }
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('generateMetadata: failed to fetch shop', err);
    return {};
  }
}

export default async function Listing(props) {
  const params = await props.params;
  const { slug } = params;
  // Fetch shop and filters safely — if API is down, show 404 for this page
  try {
    if (!baseUrl) return notFound();

    const res = await fetch(`${baseUrl}/api/shops/${slug}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!res.ok) return notFound();

    const response = await res.json();
    if (!response?.success || !response?.data) return notFound();

    const { data: shopData } = response;

    let filters = [];
    try {
      const res2 = await fetch(`${baseUrl}/api/products/filters`, {
        next: { revalidate: 60 }
      });
      if (res2.ok) {
        const response2 = await res2.json();
        filters = response2?.data || [];
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Listing: failed to fetch filters', err);
      filters = [];
    }

    // Render normally
    return (
      <Box>
        <Box sx={{ bgcolor: 'background.default' }}>
          <Container maxWidth="xl">
            <HeaderBreadcrumbs
              heading={shopData?.name}
              links={[
                {
                  name: 'Home',
                  href: '/'
                },
                {
                  name: 'Shops',
                  href: '/shops'
                },
                {
                  name: shopData?.name
                }
              ]}
            />

            <ProductList shop={shopData} filters={filters} />
          </Container>
        </Box>
      </Box>
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Listing: failed to fetch shop data', err);
    return notFound();
  }

  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container maxWidth="xl">
          <HeaderBreadcrumbs
            heading={shopData?.name}
            links={[
              {
                name: 'Home',
                href: '/'
              },
              {
                name: 'Shops',
                href: '/shops'
              },
              {
                name: shopData?.name
              }
            ]}
          />

          <ProductList shop={shopData} filters={filters} />
        </Container>
      </Box>
    </Box>
  );
}
