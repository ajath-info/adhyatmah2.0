import React from 'react';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import UsersDetails from '@/components/_admin/users/user-details';

export default async function page(props) {
  const params = await props.params;
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="User Details"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Users',
            href: '/admin/users'
          },
          {
            name: 'Users details'
          }
        ]}
      />
      <UsersDetails id={params.id} />
    </div>
  );
}
