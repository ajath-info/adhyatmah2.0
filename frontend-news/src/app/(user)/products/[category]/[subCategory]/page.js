// mui
import { Box, Container } from '@mui/material';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import ProductList from 'src/components/_main/products';

import Categories from '@/components/_main/home/categories';
export const revalidate = 60;
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function generateStaticParams() {
  try {
    if (!baseUrl) return [];
    const res = await fetch(`${baseUrl}/api/sub-categories-slugs`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) return [];

    const { data } = await res.json();

    return data?.map((sub) => ({ subCategory: sub.slug })) || [];
  } catch (err) {
    console.warn('generateStaticParams: failed to fetch sub-categories-slugs', err);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { subCategory } = await params;

  try {
    if (!baseUrl) return {};
    const res = await fetch(`${baseUrl}/api/sub-categories/${subCategory}`, {
      cache: 'force-cache'
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
    console.warn('generateMetadata: failed to fetch sub-category', err);
    return {};
  }
}

export default async function Listing(props) {
  const params = await props.params;
  const { category, subCategory } = params;
  try {
    if (!baseUrl) return notFound();

    const res = await fetch(`${baseUrl}/api/sub-categories/${subCategory}`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) return notFound();

    const response = await res.json();
    if (!response?.success || !response?.data) return notFound();

    const { data: subCategoryData } = response;
    const childCategories = subCategoryData?.childCategories || [];

    let filters = [];
    try {
      const res2 = await fetch(`${baseUrl}/api/products/filters`, { next: { revalidate: 60 } });
      if (res2.ok) {
        const response2 = await res2.json();
        filters = response2?.data || [];
      }
    } catch (err) {
      console.warn('Listing: failed to fetch filters', err);
      filters = [];
    }

    return (
      <Box>
        <Box sx={{ bgcolor: 'background.default' }}>
          <Container maxWidth="xl">
            <Box sx={{ mb: 4 }}>
              <HeaderBreadcrumbs
                heading={subCategoryData?.name}
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
                    name: subCategoryData?.parentCategory?.name,
                    href: `/products/${category}`
                  },
                  {
                    name: subCategoryData?.name
                  }
                ]}
              />
            </Box>

            {Boolean(childCategories.length) && (
              <Categories data={childCategories || []} slug={category + '/' + subCategory} />
            )}

            <ProductList subCategory={subCategoryData} filters={filters} />
          </Container>
        </Box>
      </Box>
    );
  } catch (err) {
    console.warn('Listing: failed to fetch sub-category data', err);
    return notFound();
  }
}
