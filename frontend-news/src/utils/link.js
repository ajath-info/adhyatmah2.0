import React from 'react';
import NextLink from 'next/link';
import MuiLink from '@mui/material/Link';
export default function Link({ href, children, ...props }) {
  return (
    <MuiLink component={NextLink} href={href} {...props}>
      {children}
    </MuiLink>
  );
}
