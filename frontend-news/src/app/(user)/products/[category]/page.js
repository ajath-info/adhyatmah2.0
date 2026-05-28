// mui
import { Box, Container } from '@mui/material';
import { notFound } from 'next/navigation';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import ProductList from 'src/components/_main/products';
import Categories from '@/components/_main/home/categories';

export const revalidate = 60;
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function generateStaticParams() {
  try {
    if (!baseUrl) return [];
    const res = await fetch(`${baseUrl}/api/categories-slugs`, {
      next: { revalidate: 3600 } // Cache slug list for 1 hour
    });

    if (!res.ok) return [];

    const { data } = await res.json();

    return data?.map((a) => ({ category: a.slug })) || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('generateStaticParams: failed to fetch categories-slugs', err);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { category } = await params;

  try {
    if (!baseUrl) return {};
    const res = await fetch(`${baseUrl}/api/categories/${category}`, {
      cache: 'force-cache' // Prefer cached
    });

    if (!res.ok) return {};

    const { data: currentCategory } = await res.json();

    if (!currentCategory) return {};

    return {
      title: currentCategory.metaTitle || currentCategory.name,
      description: currentCategory.metaDescription || currentCategory.description,
      openGraph: {
        title: currentCategory.name,
        description: currentCategory.metaDescription || currentCategory.description
      }
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('generateMetadata: failed to fetch category', err);
    return {};
  }
}

export default async function Listing(props) {
  const params = await props.params;
  const { category } = params;
  try {
    if (!baseUrl) return notFound();

    const res = await fetch(`${baseUrl}/api/categories/${category}`, { next: { revalidate: 60 } });
    if (!res.ok) return notFound();

    const response = await res.json();
    if (!response?.success || !response?.data) return notFound();

    const { data: categoryData } = response;
    const subCategories = categoryData?.subCategories || [];

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
              heading={categoryData?.name}
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
                  name: categoryData?.name
                }
              ]}
            />
            {/* {Boolean(subCategories.length) && <Categories data={subCategories || []} slug={category} />} */}

            {Boolean(subCategories.length) && (
              <Box sx={{ mt: 4 }}>
                <Categories data={subCategories || []} slug={category} />
              </Box>
            )}

            <ProductList category={categoryData} filters={filters} />
          </Container>
        </Box>
      </Box>
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Listing: failed to fetch category data', err);
    return notFound();
  }
}
