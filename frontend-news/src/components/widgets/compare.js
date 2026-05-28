import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

// mui
import { IconButton, alpha, Stack, Typography } from '@mui/material';

// icons
import { GoGitCompare } from 'react-icons/go';

export default function CompareWidget() {
  const { products: compareProducts } = useSelector(({ compare }) => compare);
  return (
    <Link href="/compare">
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        width="auto"
        sx={{
          cursor: 'pointer',
          '&:hover': {
            button: {
              bgcolor: 'primary.main',
              color: 'white',
              borderColor: 'primary.main'
            }
          }
        }}
      >
        <IconButton
          aria-label="compare"
          color="primary"
          disableRipple
          sx={{
            outlineWidth: 1,
            outlineColor: 'primary',
            outlineStyle: 'solid',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <GoGitCompare />
        </IconButton>
        <Stack gap={0.5}>
          <Typography lineHeight={1} variant="subtitle2" color="text.primary">
            Compare
          </Typography>
          <Typography variant="body1" lineHeight={1} color="text.secondary">
            {compareProducts?.length || 0} {compareProducts?.length > 1 ? 'Items' : 'Item'}
          </Typography>
        </Stack>
      </Stack>
    </Link>
  );
}
