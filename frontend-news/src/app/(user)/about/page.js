import React from 'react';

// mui
import { Container } from '@mui/material';

// component import
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import AboutUs from 'src/components/_main/about';


// SEO
export const metadata = {
  title: 'About Adhyatmah | Spiritual Guidance, Vedic Rituals & Astrology Services',

  description: 'Learn more about Adhyatmah and our approach to spiritual guidance, Vedic rituals, astrology consultations, and authentic puja services designed to support peace, clarity, and positive living.',
};


// OPTIONAL
export const dynamic = 'force-dynamic';
export const revalidate = 0;


// PAGE
export default function Page() {
  return (
    <Container maxWidth="xl">

      <HeaderBreadcrumbs
        heading="About Us"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'About us'
          }
        ]}
      />

      <AboutUs />

    </Container>
  );
}