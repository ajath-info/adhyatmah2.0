import React from 'react';

import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import ShopMain from '@/components/_admin/shop';

export default async function Page({ params }) {
  const { slug } = await params;
  return (
    <div>
      <HeaderBreadcrumbs
        heading="Edit Pandit Profile"
        admin
        links={[
          { name: 'Dashboard', href: '/admin/dashboard' },
          { name: 'Pandits', href: '/admin/shops' },
          { name: 'Edit Pandit Profile' }
        ]}
      />
      <ShopMain slug={slug} />
    </div>
  );
}
