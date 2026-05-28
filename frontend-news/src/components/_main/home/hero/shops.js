'use client';
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';

// material
import { alpha } from '@mui/material/styles';
import { Box, List, Card, ListItem, Typography, Stack, Button } from '@mui/material';
import { FaAngleRight } from 'react-icons/fa6';
// ----------------------------------------------------------------------

const ITEM_HEIGHT = 40;
// ----------------------------------------------------------------------

function ParentItem({ vendor, isLast }) {
  const activeStyle = {
    color: 'primary.main',
    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
  };

  return (
    <ListItem
      href={`/vendors/${vendor?.id}`}
      component={Link}
      sx={{
        padding: (theme) => theme.spacing(3.5, 2),
        height: ITEM_HEIGHT,
        cursor: 'pointer',
        color: 'text.primary',
        typography: 'subtitle2',
        textTransform: 'capitalize',
        justifyContent: 'space-between',
        transition: (theme) => theme.transitions.create('all'),
        borderBottom: (theme) => `1px solid ${isLast ? 'transparent' : theme.palette.divider}`,
        '&:hover': activeStyle
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          component="span"
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden',
            border: (theme) => `solid 1px ${theme.palette.divider}`
          }}
        >
          <Image src={vendor?.image?.url || '/images/default-avatar.png'} alt={`${vendor?.firstName} ${vendor?.lastName}`} layout="fill" objectFit="cover" size="30vw" />
        </Box>
        <Typography variant="body1" color="text.primary" fontWeight={500}>
          {vendor?.firstName} {vendor?.lastName}
        </Typography>
      </Stack>
    </ListItem>
  );
}

ParentItem.propTypes = { vendor: PropTypes.object, isLast: PropTypes.bool };

export default function HeroVendors({ data, ...other }) {
  return (
    <List
      component={Card}
      disablePadding
      {...other}
      sx={{
        minWidth: 280,
        bgcolor: 'background.paper',
        borderRadius: '12px',
        height: 343,
        overflowY: 'auto',
        overflowX: 'auto',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        display: { md: 'flex', xs: 'none' },
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        {data.slice(0, 5).map((vendor, i) => (
          <ParentItem key={Math.random()} vendor={vendor} isLast={i === 4} />
        ))}
      </div>
      <Button
        variant="contained"
        fullWidth
        component={Link}
        href="/shops"
        endIcon={<FaAngleRight size={14} />}
        sx={{
          border: 'none !important',
          borderRadius: 'unset',
          paddingY: (theme) => theme.spacing(3.5)
        }}
      >
        View All
      </Button>
    </List>
  );
}
