'use client';
import React from 'react';
import Link from 'next/link';

// mui
import { alpha } from '@mui/material/styles';
import { Typography, Container, Stack, Box, IconButton, Grid, Fab, Divider, useTheme } from '@mui/material';

// components
import NewsLetter from './newsletter';
import Logo from '@/components/logo';

// icons
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { MdOutlineLocationOn } from 'react-icons/md';
import { FiMail } from 'react-icons/fi';
import { MdOutlineCall } from 'react-icons/md';
import Image from 'next/image';

const MAIN_LINKS = [
  {
    heading: 'Resources',
    listText1: 'Contact us',
    listLink1: '/contact',
    listText2: 'Products',
    listLink2: '/products',
    listText3: 'Pandit Ji',
    listLink3: '/shops',
    listText4: 'Services',
    listLink4: '/online-puja-services'
  },
  {
    heading: 'About us',
    listText1: 'About us',
    listLink1: '/about',
    listText2: 'Privacy Policy',
    listLink2: '/privacy-policy',
    listText3: 'Terms & Conditions',
    listLink3: '/terms-and-conditions',
    listText4: 'Refund Return Policy',
    listLink4: '/refund-return-policy',
    listText5: 'Request Delete Account',
    listLink5: '/delete-account'
  }
];

export default function Footer({ branding }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: (theme) => alpha(theme.palette.primary.light, 0.1),
        py: 4,
        mt: 7,
        overflow: 'hidden',
        position: 'relative',

        display: {
          md: 'block',
          xs: 'none'
        }
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid size={3}>
            <Stack spacing={3}>
              <Logo branding={branding} />
              <Stack>
                <Stack direction={'row'} alignItems={'center'} gap={2}>
                  <IconButton
                    sx={{
                      svg: {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    <MdOutlineLocationOn />
                  </IconButton>
                  <Typography variant="body1" color="text.secondary">
                    {branding.contact.address}
                  </Typography>
                </Stack>

                <Stack direction={'row'} alignItems={'center'} gap={2}>
                  <IconButton
                    sx={{
                      svg: {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    <MdOutlineCall />
                  </IconButton>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="a"
                    href="/"
                    sx={{
                      ':hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    {branding.contact.whatsappNo}
                  </Typography>
                </Stack>
                <Stack direction={'row'} alignItems={'center'} gap={2}>
                  <IconButton
                    sx={{
                      svg: {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    <FiMail />
                  </IconButton>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="a"
                    href="/"
                    sx={{
                      ':hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    {branding.contact.email}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          {MAIN_LINKS.map((item, idx) => (
            <Grid size={2} key={idx}>
              <Stack spacing={3}>
                <Typography variant="h4" color="text.primary">
                  {item.heading}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    a: {
                      '&:hover': {
                        color: theme.palette.primary.main
                      }
                    }
                  }}
                >
                  <Typography color="text.secondary" variant="subtitle1" component={Link} href={`${item.listLink1}`}>
                    {item.listText1}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle1" component={Link} href={`${item.listLink2}`}>
                    {item.listText2}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle1" component={Link} href={`${item.listLink3}`}>
                    {item.listText3}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle1" component={Link} href={`${item.listLink4}`}>
                    {item.listText4}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle1" component={Link} href={`${item.listLink5}`}>
                    {item.listText5}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          ))}

          <Grid size={5}>
            <Stack spacing={3}>
              <Typography variant="h4" color="text.primary">
                Join a Newsletter
              </Typography>
              <NewsLetter />

              {/* Social Icons Row */}
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} flexWrap="wrap">
                {branding?.socialLinks?.facebook && (
                  <Fab
                    size="small"
                    color="primary"
                    component={Link}
                    href={branding.socialLinks.facebook}
                    target="_blank"
                  >
                    <FaFacebookF size={18} />
                  </Fab>
                )}

                {branding?.socialLinks?.instagram && (
                  <Fab
                    size="small"
                    color="primary"
                    component={Link}
                    href={branding.socialLinks.instagram}
                    target="_blank"
                  >
                    <FaInstagram size={18} />
                  </Fab>
                )}

                {branding?.socialLinks?.linkedin && (
                  <Fab
                    size="small"
                    color="primary"
                    component={Link}
                    href={branding.socialLinks.linkedin}
                    target="_blank"
                  >
                    <FaLinkedinIn size={18} />
                  </Fab>
                )}

                {branding?.socialLinks?.twitter && (
                  <Fab
                    size="small"
                    color="primary"
                    component={Link}
                    href={branding.socialLinks.twitter}
                    target="_blank"
                  >
                    <FaXTwitter size={18} />
                  </Fab>
                )}

                {branding?.socialLinks?.youtube && (
                  <Fab
                    size="small"
                    color="primary"
                    component={Link}
                    href={branding.socialLinks.youtube}
                    target="_blank"
                  >
                    <FaYoutube size={18} />
                  </Fab>
                )}
              </Stack>

              {/* App Store Badges */}
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
                <Link
                  href="https://play.google.com/store/apps/details?id=com.app.adhyatmah"
                  target="_blank"
                >
                  <Image
                    src="/images/playstore.svg"
                    alt="Get it on Google Play"
                    width={130}
                    height={40}
                  />
                </Link>

                <Link
                  href="https://apps.apple.com/in/app/adhyatmah/id6749001841"
                  target="_blank"
                >
                  <Image
                    src="/images/appstore.svg"
                    alt="Download on the App Store"
                    width={130}
                    height={40}
                  />
                </Link>
              </Stack>

            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body1" color="text.primary" textAlign="center">
          © 2026 Adhyatmah Bharat. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}