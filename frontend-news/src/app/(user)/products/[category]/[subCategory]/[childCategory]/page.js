// mui
import { Box, Container } from '@mui/material';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import ProductList from 'src/components/_main/products';
// Static generation with ISR
export const revalidate = 60;

// Base URL
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function generateStaticParams() {
  try {
    if (!baseUrl) return [];
    const res = await fetch(`${baseUrl}/api/child-categories-slugs`, {
      next: { revalidate: 3600 } // Cache slug list for 1 hour
    });

    if (!res.ok) return [];

    const { data } = await res.json();

    return data?.map((child) => ({ childCategory: child.slug })) || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('generateStaticParams: failed to fetch child-categories-slugs', err);
    return [];
  }
}

// // Generate metadata per brand
export async function generateMetadata({ params }) {
  const { childCategory } = await params;
  try {
    if (!baseUrl) return {};
    const res = await fetch(`${baseUrl}/api/child-categories/${childCategory}`, {
      cache: 'force-cache' // Prefer cached
    });

    if (!res.ok) return {};

    const { data: child } = await res.json();

    if (!child) return {};

    return {
      title: child.metaTitle,
      description: child.metaDescription,
      openGraph: {
        title: child.metaTitle,
        description: child.metaDescription
      }
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('generateMetadata: failed to fetch child-category', err);
    return {};
  }
}
export default async function Listing(props) {
  const params = await props.params;

  const { category, subCategory, childCategory } = params;
  try {
    if (!baseUrl) return notFound();

    const res = await fetch(`${baseUrl}/api/child-categories/${childCategory}`, { next: { revalidate: 60 } });
    if (!res.ok) return notFound();

    const response = await res.json();
    if (!response?.success || !response?.data) return notFound();

    const { data: childCategoryData } = response;

    let filters = [];
    try {
      const res2 = await fetch(`${baseUrl}/api/products/filters`, { next: { revalidate: 60 } });
      if (res2.ok) {
        const response2 = await res2.json();
        filters = response2?.data || [];
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Listing: failed to fetch filters', err);
      filters = [];
    }

    return (
      <Box>
        <Box sx={{ bgcolor: 'background.default' }}>
          <Container maxWidth="xl">
            <HeaderBreadcrumbs
              heading={childCategoryData?.name}
              links={[
                {
                  name: 'Home',
                  href: '/'
                },
                {
                  name: 'Products',
                  href: '/products'
                },
                {
                  name: childCategoryData.subCategory?.parentCategory.name,
                  href: `/products/${category}`
                },
                {
                  name: childCategoryData.subCategory?.name,
                  href: `/products/${category}/${subCategory}`
                },
                {
                  name: childCategoryData?.name
                }
              ]}
            />

            <ProductList childCategory={childCategoryData} filters={filters} />
          </Container>
        </Box>
      </Box>
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Listing: failed to fetch child-category data', err);
    return notFound();
  }
}


