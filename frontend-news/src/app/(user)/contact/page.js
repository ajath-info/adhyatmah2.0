import React from 'react';

// mui
import { Container } from '@mui/material';

// component
import ContactUsMain from '@/components/_main/contact-us';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// SEO
export const metadata = {
  title: 'Contact Us for Pandit Booking & Puja Services | Adhyatmah',

  description: 'Get in touch with Adhyatmah for pandit booking, puja services, and spiritual guidance. Contact our team for quick support, consultation, and easy service assistance.',
};

export default function Page() {
  return (
    <Container maxWidth="xl">
      <HeaderBreadcrumbs
        heading="Contact Us"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Contact us'
          }
        ]}
      />
      <ContactUsMain />
    </Container>
  );
}
