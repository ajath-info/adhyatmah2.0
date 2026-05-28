import React from 'react';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import NewsletterMain from '@/components/_admin/newsletter/newsletter';

// Meta information
export const metadata = {
  title: 'Newsletter - adhyatmah',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah'
};
export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Newsletter List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'newsletter'
          }
        ]}
      />
      <NewsletterMain />
    </div>
  );
}
