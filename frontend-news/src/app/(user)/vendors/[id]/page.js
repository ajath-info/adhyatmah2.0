'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

// mui
import {
  Typography,
  Container,
  Stack,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Alert,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';

// icons
import { MdPhone, MdEmail, MdLocationOn, MdWork, MdExpandMore, MdVerified, MdCheckCircle } from 'react-icons/md';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';
import PoojaCard from 'src/components/cards/service/PoojaCard';

// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';

const UPDATED_SERVICE_IMAGE_URLS = [
  '/images/pooja/Updated Images/1) Rudrabhishek puja.jpeg',
  '/images/pooja/Updated Images/2) Satyanarayan Puja.jpeg',
  '/images/pooja/Updated Images/3) Mool Puja.png',
  '/images/pooja/Updated Images/4) Bhoomi neev puja.png',
  '/images/pooja/Updated Images/5) Griha Pravesh Puja.png',
  '/images/pooja/Updated Images/6) Griha Vastu Shanti Puja.png',
  '/images/pooja/Updated Images/7) Namkaran Puja.png',
  '/images/pooja/Updated Images/8) Annaprashan Sanskar Puja.png',
  '/images/pooja/Updated Images/9) Navratri Puja.png',
  '/images/pooja/Updated Images/10) Dhanteras Puja.png',
  '/images/pooja/Updated Images/11) Diwali Puja.png',
  '/images/pooja/Updated Images/12) Engagement Puja.png',
  '/images/pooja/Updated Images/13) Tilak Puja.png',
  '/images/pooja/Updated Images/14) Vivah Puja.png',
  '/images/pooja/Updated Images/15) Sunderkand Path.png',
  '/images/pooja/Updated Images/16) Saraswati Puja.png',
  '/images/pooja/Updated Images/17) Vishwakarma Puja.png',
  '/images/pooja/Updated Images/18) Krishna Janmashtami Puja.png',
  '/images/pooja/Updated Images/19) Hanuman Janmotsav.png',
  '/images/pooja/Updated Images/20) Ram Navami Puja.png',
  '/images/pooja/Updated Images/21) Akshaya Tritiya Puja.png',
  '/images/pooja/Updated Images/22) Holika Puja.png',
  '/images/pooja/Updated Images/23) Govardhan Puja.png',
  '/images/pooja/Updated Images/24) Mahalakshmi Puja.png',
  '/images/pooja/Updated Images/25) Haritalika Teej Vrat Puja.png',
  '/images/pooja/Updated Images/26) Navagraha-Shanti-Puja.png',
  '/images/pooja/Updated Images/27) Budh (Mercury) Graha Shanti Puja.png',
  '/images/pooja/Updated Images/28) Shukra (Venus) Graha Shanti Puja.png',
  '/images/pooja/Updated Images/29) Chandra (Moon) Graha Shanti Puja.png',
  '/images/pooja/Updated Images/30) Brihaspati (Jupiter) Graha Shanti Puja.png',
  '/images/pooja/Updated Images/31) Surya (Sun) Graha Shanti Puja.png',
  '/images/pooja/Updated Images/32) Mangal (Mars) Graha Shanti Puja.png',
  '/images/pooja/Updated Images/33) rahu Graha Shanti Puja.png',
  '/images/pooja/Updated Images/34) ketu Graha Shanti Puja.png',
  '/images/pooja/Updated Images/35) Shani Graha Shanti Puja.png',
  '/images/pooja/Updated Images/36) Pitru Dosh Nivaran Puja.png',
  '/images/pooja/Updated Images/37) Santan Gopal Mantra Chant.png',
  '/images/pooja/Updated Images/38) Kalsarpa Dosha Nivaran Puja.png',
  '/images/pooja/Updated Images/39) Ganesh Puja.png',
  '/images/pooja/Updated Images/40) Janeu, Yajnopaveet (Upanayana Sanskar).png',
  '/images/pooja/Updated Images/41) Business Opening Puja.png',
  '/images/pooja/Updated Images/42) Manglik Dosha Nivaran Puja (KumbhArk Marriage).png',
  '/images/pooja/Updated Images/43) Shanti Puja (Poorvajon ke lie).png',
  '/images/pooja/Updated Images/45) marriage anniversary puja.png',
  '/images/pooja/Updated Images/46) Varshik Shradh Puja.png',
  '/images/pooja/Updated Images/47) Godh Bharai.png',
  '/images/pooja/Updated Images/48) Kuber Upasana Puja.png',
  '/images/pooja/Updated Images/49) Birthday Puja.png',
  '/images/pooja/Updated Images/50) Shuddhikaran Puja.png',
  '/images/pooja/Updated Images/51) Pind Daan.png',
  '/images/pooja/Updated Images/52) Pitru Paksha Shradhya Puja.png',
  '/images/pooja/Updated Images/53) Tripindi Shradhya Puja.png',
  '/images/pooja/Updated Images/54) Bharani Shradhya Puja.png',
  '/images/pooja/Updated Images/55) Rin Mukti Puja.png'
];

const normalizeServiceName = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const LOCAL_SERVICE_IMAGE_BY_NAME = UPDATED_SERVICE_IMAGE_URLS.reduce((acc, imageUrl) => {
  const fileName = imageUrl.split('/').pop() || '';
  const withoutExt = fileName.replace(/\.[^/.]+$/, '');
  const withoutNumbering = withoutExt.replace(/^\d+\)\s*/, '');
  acc[normalizeServiceName(withoutNumbering)] = imageUrl;
  return acc;
}, {});

const FAQ_DATA = [
  {
    question: 'How can I book a pandit for puja?',
    answer:
      'You can select the required puja service from the list above and proceed with the booking process through the platform.'
  },
  {
    question: 'What types of puja services are available?',
    answer:
      'Services include grah shanti puja, vastu puja, satyanarayan katha, griha pravesh, havan, and other Hindu rituals.'
  },
  {
    question: 'Can I choose puja based on my requirement?',
    answer: 'Yes, you can select the puja service depending on your occasion and requirement.'
  }
];

// ─── SEO Content Card Component ────────────────────────────────────────────────
function SeoContentCard({ vendor }) {
  const experienceLabel = vendor?.experience
    ? `${vendor.experience}+ Years`
    : '25+ Years';

  const seoDetails = [
    { label: 'Experience', value: experienceLabel },
    {
      label: 'Specialization',
      value: vendor?.specialization || 'Grah Shanti, Vastu Puja, Satyanarayan Katha, Griha Pravesh'
    },
    { label: 'Services', value: 'Multiple Puja & Ritual Services' },
    { label: 'Availability', value: 'Available for Home Services' }
  ];

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>

        {/* ── About Pandit Ji ── */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
          About Pandit Ji
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {vendor.firstName} {vendor.lastName} is a dedicated and experienced Vedic pandit with over{' '}
          {vendor?.experience ? `${vendor.experience}` : '25'} years of expertise in performing Hindu rituals and puja
          ceremonies. He is known for providing reliable pandit services for grah shanti puja, vastu puja, satyanarayan
          katha, griha pravesh, and havan with proper vidhi and discipline.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          If you are looking to hire pandit for rituals or{' '}
          <a
            href="https://www.adhyatmah.com/"
            style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline' }}
          >
            book pandit for puja online
          </a>
          , he offers trusted and professional home services. His deep knowledge of Vedic pandit services and calm
          approach help families perform rituals with ease and confidence while maintaining authenticity in every
          ceremony.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* ── Additional Details ── */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Additional Details
        </Typography>
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {seoDetails.map((item) => (
            <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: 'action.hover'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 110, flexShrink: 0 }}>
                  {item.label}:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* ── Trust Badges ── */}
        <Stack direction="row" spacing={2} sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
          <Chip
            icon={<MdVerified size={16} />}
            label="Verified Pandit"
            color="success"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            icon={<MdCheckCircle size={16} />}
            label="Trusted Services"
            color="primary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* ── FAQ Section ── */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Frequently Asked Questions
        </Typography>
        <Stack spacing={1}>
          {FAQ_DATA.map((faq, index) => (
            <Accordion
              key={index}
              disableGutters
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px !important',
                '&:before': { display: 'none' },
                '&.Mui-expanded': { borderColor: 'primary.main' }
              }}
            >
              <AccordionSummary
                expandIcon={<MdExpandMore size={20} />}
                sx={{ px: 2, py: 0.5, minHeight: 48 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>

      </CardContent>
    </Card>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id;

  const { data: vendorData, isPending: vendorLoading, error: vendorError } = useQuery({
    queryKey: ['vendor-profile', vendorId],
    queryFn: () => api.getPanditProfile(vendorId),
    enabled: !!vendorId
  });

  const { data: servicesData, isPending: servicesLoading, error: servicesError } = useQuery({
    queryKey: ['vendor-services', vendorId],
    queryFn: () => api.getPanditServices(vendorId),
    enabled: !!vendorId
  });

  function getAgeFromDOB(dob) {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (today.getDate() < birthDate.getDate()) months -= 1;
    if (months < 0) { years -= 1; months += 12; }
    return months > 0 ? `${years}+ years` : `${years} years`;
  }

  const vendor = vendorData?.payload?.vendor;
  const services = servicesData?.payload?.services || [];

  // ✅ FIXED: Partial match logic — exact match pehle, phir partial match
  const getLocalServiceImageByName = (poojaType = '') => {
    const normalized = normalizeServiceName(poojaType);

    // 1. Exact match try karo
    if (LOCAL_SERVICE_IMAGE_BY_NAME[normalized]) {
      return LOCAL_SERVICE_IMAGE_BY_NAME[normalized];
    }

 
    const found = Object.entries(LOCAL_SERVICE_IMAGE_BY_NAME).find(([key]) =>
      normalized.includes(key) || key.includes(normalized)
    );

    return found ? found[1] : '';
  };

  // ── Loading State ──
  if (vendorLoading) {
    return (
      <Container maxWidth="xl">
        <Stack gap={3}>
          <HeaderBreadcrumbs heading="Loading..." links={[{ name: 'Home', href: '/' }, { name: 'Pandits', href: '/shops' }]} />
          <Typography>Loading vendor details...</Typography>
        </Stack>
      </Container>
    );
  }

  // ── Error State ──
  if (vendorError || !vendor) {
    return (
      <Container maxWidth="xl">
        <Stack gap={3}>
          <HeaderBreadcrumbs heading="Vendor Not Found" links={[{ name: 'Home', href: '/' }, { name: 'Pandits', href: '/shops' }]} />
          <Typography variant="h3" color="error.main" textAlign="center">
            Vendor not found
          </Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Stack gap={3}>
        <HeaderBreadcrumbs
          heading={`${vendor.firstName} ${vendor.lastName}`}
          links={[
            { name: 'Home', href: '/' },
            { name: 'Pandits', href: '/shops' },
            { name: `${vendor.firstName} ${vendor.lastName}` }
          ]}
        />

        <Grid container spacing={3}>
          {/* ── LEFT COLUMN ── */}
          <Grid size={{ lg: 4, md: 12 }}>
            <Stack spacing={3}>

              {/* Profile Card */}
              <Card>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Avatar
                      src={vendor.image?.url || '/images/default-avatar.png'}
                      alt={`${vendor.firstName} ${vendor.lastName}`}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        border: (theme) => `3px solid ${theme.palette.primary.main}`
                      }}
                    />
                  </Box>

                  <Typography variant="h4" gutterBottom>
                    {vendor.firstName} {vendor.lastName}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Experience:</strong>{' '}
                    <Typography component="span" color="text.secondary">
                      {vendor?.experience ? `${vendor.experience} years` : '-'}
                    </Typography>
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Gotra:</strong>{' '}
                    <Typography component="span" color="text.secondary">
                      {vendor?.gotra || '-'}
                    </Typography>
                  </Typography>

                  {vendor.language && vendor.language.length > 0 && (
                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        Languages
                      </Typography>
                      <Stack direction="row" sx={{ mt: 1, justifyContent: 'center', flexWrap: 'wrap', rowGap: 1.2, columnGap: 1.2 }}>
                        {vendor.language.map((lang, index) => (
                          <Chip key={index} label={lang} size="small" variant="outlined" sx={{ textTransform: 'capitalize', fontWeight: 500 }} />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Pandit Ji Details Card */}
              <Card>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    Pandit Ji Details
                  </Typography>
                  <Grid container spacing={2}>
                    {vendor.gotra && (
                      <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
                        <Typography variant="subtitle2" color="text.secondary">Gotra</Typography>
                        <Typography variant="body1">{vendor.gotra}</Typography>
                      </Grid>
                    )}
                    {vendor.veda && (
                      <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
                        <Typography variant="subtitle2" color="text.secondary">Veda</Typography>
                        <Typography variant="body1">{vendor.veda}</Typography>
                      </Grid>
                    )}
                    {vendor.pankti && (
                      <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
                        <Typography variant="subtitle2" color="text.secondary">Pankti</Typography>
                        <Typography variant="body1">{vendor.pankti}</Typography>
                      </Grid>
                    )}
                    {vendor.shakha && (
                      <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
                        <Typography variant="subtitle2" color="text.secondary">Shakha</Typography>
                        <Typography variant="body1">{vendor.shakha}</Typography>
                      </Grid>
                    )}
                    {vendor.sutra && (
                      <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
                        <Typography variant="subtitle2" color="text.secondary">Sutra</Typography>
                        <Typography variant="body1">{vendor.sutra}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>

              {/* SEO Content Card */}
              <SeoContentCard vendor={vendor} />

            </Stack>
          </Grid>

          {/* ── RIGHT COLUMN ── */}
          <Grid size={{ lg: 8, md: 12 }}>
            <Stack spacing={3}>

              {/* About Section */}
              <Card>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    About Pandit Ji
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {vendor.about || 'Experienced pandit offering authentic pooja services with traditional rituals and modern convenience.'}
                  </Typography>
                </CardContent>
              </Card>

              {/* Services Section */}
              <Card>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    Services Offered
                  </Typography>

                  {servicesLoading ? (
                    <Typography>Loading services...</Typography>
                  ) : servicesError ? (
                    <Alert severity="error">Failed to load services</Alert>
                  ) : services.length > 0 ? (
                    <Grid container spacing={2}>
                      {services.map((service) => {
                        const localImage = getLocalServiceImageByName(service.poojaType);
                        const resolvedImage =
                          service.image?.url ||
                          service.images?.[0]?.url ||
                          service.imageUrl ||
                          service.thumbnail ||
                          localImage ||
                          '';

                        return (
                          <Grid key={service.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <PoojaCard
                              isLoading={false}
                              singleAction
                              actionLabel="View Details & Book"
                              actionUrl={`/vendors/${vendor.id}/services/${service.id}`}
                              service={{
                                id: service.id,
                                name: service.poojaType,
                                price: service.price,
                                originalPrice: service.originalPrice || Math.round((service.price || 0) * 1.13),
                                duration: service.duration,
                                views: service.views || 2800,
                                image: { url: resolvedImage },
                                imageUrl: resolvedImage,
                                thumbnail: resolvedImage
                              }}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No services available at the moment
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* Empty card placeholder */}
              <Card />

            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}