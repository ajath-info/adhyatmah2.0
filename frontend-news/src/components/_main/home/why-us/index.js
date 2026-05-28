'use client';
// react
import React from 'react';
// mui
import { Typography, Card, Stack, Divider, Fab, alpha, Container } from '@mui/material';

// icons
import { MdOutlineSupportAgent } from 'react-icons/md';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { VscFeedback } from 'react-icons/vsc';
import { MdSettingsBackupRestore } from 'react-icons/md';
import { RiExchangeDollarLine } from 'react-icons/ri';

export default function WhyUs() {
  const data = [
    {
      title: 'Free Shipping',
      icon: <AiOutlineShoppingCart />,
      description: ' All over India'
    },
    {
      title: 'Feedbacks',
      icon: <VscFeedback />,
      description: '100% Customer'
    },
    {
      title: 'Free Return',
      icon: <MdSettingsBackupRestore />,
      description: '7 Days Returns Policy'
    },
    {
      title: 'Secure System',
      icon: <RiExchangeDollarLine />,
      description: '100% Secure Gaurantee'
    },
    {
      title: 'Online Supports',
      icon: <MdOutlineSupportAgent />,
      description: '24/7 Dedicated Support.'
    }
  ];
  return (
    <Container
      maxWidth="xl"
      sx={{
        display: {
          md: 'block',
          xs: 'none'
        }
      }}
    >
      <Card
        sx={{
          p: 3,
          borderRadius: '12px'

          // borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={1}>
          {data.map((v, i) => (
            <React.Fragment key={Math.random()}>
              <Stack
                direction="row"
                alignItems="center"
                // justifyContent="center"
                gap={1}
                spacing={1}
                sx={{
                  svg: {
                    color: 'primary.main',
                    fontSize: 24
                  }
                }}
              >
                <Fab
                  sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), boxShadow: 'none' }}
                  color="primary"
                >
                  {v.icon}
                </Fab>

                <Stack>
                  <Typography variant="h5" color="text.primary">
                    {v.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {v.description}
                  </Typography>
                </Stack>
              </Stack>
              {i !== 4 ? <Divider orientation="vertical" flexItem /> : null}
            </React.Fragment>
          ))}
        </Stack>
      </Card>
    </Container>
  );
}
