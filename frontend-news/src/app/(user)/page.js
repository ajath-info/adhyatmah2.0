import { Stack, Box } from '@mui/material';

// Components
import Hero from 'src/components/_main/home/hero';
import TopBanners from '@/components/_main/home/banners';
import CategoriesWithProducts from '@/components/_main/home/categories-with-products';
import Vendors from '@/components/_main/home/shops';
import PoojaServices from '@/components/_main/home/pooja-services';
import Testimonials from 'src/components/_main/home/testimonials';
import SubscriptionModal from 'src/components/_main/home/subscription';
import WhyUs from '@/components/_main/home/why-us';
import Categories from '@/components/_main/home/categories';
import WhyChooseUs from '@/components/_main/home/why-choose-us';
import FestivalBanner from '@/components/_main/home/festival-banner';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const revalidate = 60;

const PageContainer = ({ children }) => (
  <Box
    sx={{
      maxWidth: '1440px',
      mx: 'auto',
      px: { xs: 2, sm: 3, md: 4, lg: 5 },
      width: '100%',
    }}
  >
    {children}
  </Box>
);

export default async function IndexPage() {
  const response = await fetch(`${baseUrl}/api/home/unified`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch homepage data');
  }

  const { data } = await response.json();
  const { banners, categories, vendors, reviews } = data;

  const categoriesList = await fetch(`${baseUrl}/api/home/categories`, {
    next: { revalidate: 60 },
  });

  if (!categoriesList.ok) {
    throw new Error('Failed to fetch categories data');
  }

  const categoriesListJson = await categoriesList.json();

  const dummyServices = [
    {
      id: '1',
      name: 'Rudrabhishek Puja',
      price: 5100,
      originalPrice: 5801,
      duration: '3-4 Hrs',
      views: 2800,
      image: { url: '/images/poojaas/rudrabhishek-puja.jpeg' }
    },
    {
      id: '2',
      name: 'Satyanarayan Puja',
      price: 2100,
      originalPrice: 2351,
      duration: '2-3 Hrs',
      views: 1500,
      image: { url: '/images/poojaas/satyanarayan-puja.jpeg' }
    },
    {
      id: '4',
      name: 'Bhoomi Neev Puja',
      price: 2100,
      originalPrice: 2351,
      duration: '1-2 Hrs',
      views: 1200,
      image: { url: '/images/poojaas/bhoomi-neev-puja.png' }
    },
    {
      id: '19',
      name: 'Hanuman Janmotsav',
      price: 2100,
      originalPrice: 2351,
      duration: '3-4 Hrs',
      views: 1800,
      image: { url: '/images/poojaas/hanuman-janmotsav.png' }
    },
  ];

  return (
    <Stack gap={5}>
      <Hero data={vendors || []} banners={banners || {}} />

      <PageContainer>
        <Stack gap={5}>
          <TopBanners banners={banners} />

          <Categories
            data={categoriesListJson?.data || []}
            isHome
          />

          <Vendors data={vendors || []} />

          <PoojaServices services={dummyServices} />


          <WhyChooseUs />

          
          <FestivalBanner
            image="/images/festival.png"
            title="Special Puja !"
            subtitle="Limited Slots Available"
            buttonText="Book Now"
            buttonLink="https://adhyatmah.com/online-puja-services"
          />


          <CategoriesWithProducts
            data={categories || []}
            isHome
          />
        </Stack>
      </PageContainer>

      {Boolean(reviews?.length) && (
        <Testimonials data={reviews} />
      )}

      <PageContainer>
        <WhyUs />
      </PageContainer>

      <SubscriptionModal />
    </Stack>
  );
}