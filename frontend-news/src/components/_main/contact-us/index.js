'use client';
import React from 'react';
import Link from 'next/link';
// material
import { Stack, Typography, Box, Grid, IconButton } from '@mui/material';
// components
import ContactUs from '@/components/forms/contact-us';
import RootStyled from './styled';

// icons
import { MdEmail } from 'react-icons/md';
import { PiPhoneCall } from 'react-icons/pi';

const ContactUsMain = () => {
  return (
    <RootStyled>
      <Grid container spacing={6}>
        <Grid
          size={{ md: 6, xs: 12 }}
          textAlign={{ xs: 'center', md: 'left' }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Stack>
            <Typography variant="h6" fontSize="16px" textTransform="uppercase" color="primary">
              Best Your Website
            </Typography>
            <Typography variant="h1" fontWeight={800} sx={{ marginY: 2 }}>
              Get in touch <span>Today!</span>
            </Typography>
            <Typography variant="body1" fontWeight={500} color="text.secondary" sx={{ mb: 3 }}>
              We're here to listen, assist, and answer any questions you may have. Whether you're interested in our
              services, seeking collaborations, or simply want to connect, our team is ready to provide personalized
              support.
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ md: 6, sm: 6, xs: 12 }}>
                <Stack spacing={2} direction="row" alignItems="center" className="mail-box">
                  <IconButton className="choose-btn">
                    <MdEmail />
                  </IconButton>
                  <Box textAlign="left">
                    <Typography variant="h6" fontSize="18px!important" color="text.primary">
                      Email Address
                    </Typography>
                    <Typography
                      component={Link}
                      href="mailto:info@commercehope.com"
                      variant="subtitle2"
                      fontSize="14px"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      info@adhyatmah.com
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ md: 6, sm: 6, xs: 12 }}>
                <Stack spacing={2} direction="row" alignItems="center" className="phone-box">
                  <IconButton className="choose-btn">
                    <PiPhoneCall />
                  </IconButton>
                  <Box textAlign="left">
                    <Typography variant="h6" fontSize="18px!important" color="text.primary">
                      Phone
                    </Typography>
                    <Typography
                      component={Link}
                      href="tel:+919452872182"
                      variant="subtitle2"
                      fontSize="14px"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      +91 9452872182
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
        <Grid size={{ md: 6, xs: 12 }}>
          <ContactUs />
        </Grid>
      </Grid>
    </RootStyled>
  );
};

export default ContactUsMain;
