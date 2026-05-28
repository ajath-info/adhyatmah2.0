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

// ─── Per-vendor SEO content ────────────────────────────────────────────────────
import { VENDOR_SEO_CONTENT } from './vendorSeoContent';


const UPDATED_SERVICE_IMAGE_URLS = [
  '/images/poojaas/rudrabhishek-puja.jpeg',
  '/images/poojaas/satyanarayan-puja.jpeg',
  '/images/poojaas/mool-puja.png',
  '/images/poojaas/bhoomi-neev-puja.png',
  '/images/poojaas/griha-pravesh.png',
  '/images/poojaas/griha-vastu-shanti-puja.png',
  '/images/poojaas/namkaran-puja.png',
  '/images/poojaas/annaprashan-sanskar-puja.png',
  '/images/poojaas/navratri-puja.png',
  '/images/poojaas/dhanteras-puja.png',
  '/images/poojaas/diwali-puja.png',
  '/images/poojaas/engagement-puja.png',
  '/images/poojaas/tilak-puja.png',
  '/images/poojaas/vivah-puja.png',
  '/images/poojaas/sunderkand-path-mool-path.png',
  '/images/poojaas/saraswati-puja.png',
  '/images/poojaas/vishwakarma-puja.png',
  '/images/poojaas/krishna-janmashtami-puja.png',
  '/images/poojaas/hanuman-janmotsav.png',
  '/images/poojaas/ram-navami-puja.png',
  '/images/poojaas/akshaya-tritiya-puja.png',
  '/images/poojaas/holika-puja.png',
  '/images/poojaas/govardhan-puja.png',
  '/images/poojaas/mahalakshmi-puja.png',
  '/images/poojaas/haritalika-teej-vrat-puja.png',
  '/images/poojaas/navagraha-shanti-puja.png',
  '/images/poojaas/budh-graha-shanti-puja.png',
  '/images/poojaas/shukra-graha-shanti-puja.png',
  '/images/poojaas/chandra-graha-shanti-puja.png',
  '/images/poojaas/brihaspati-graha-shanti-puja.png',
  '/images/poojaas/surya-graha-shanti-puja.png',
  '/images/poojaas/mangal-graha-shanti-puja.png',
  '/images/poojaas/rahu-graha-shanti-puja.png',
  '/images/poojaas/ketu-graha-shanti-puja.png',
  '/images/poojaas/shani-graha-shanti-puja.png',
  '/images/poojaas/pitru-dosh-nivaran-puja.png',
  '/images/poojaas/pitrudosh-nivaran-puja.png',
  '/images/poojaas/santan-gopal-mantra-jaap.png',
  '/images/poojaas/santan-gopal-mantra-chant.png',
  '/images/poojaas/kalsarpa-dosha-nivaran-puja.png',
  '/images/poojaas/ganesh-puja.png',
  '/images/poojaas/janeu-yajnopaveet.png',
  '/images/poojaas/business-opening-puja.png',
  '/images/poojaas/manglik-dosha-nivaran-puja.png',
  '/images/poojaas/shanti-puja.png',
  '/images/poojaas/marriage-anniversary-puja.png',
  '/images/poojaas/varshik-shradh-puja.png',
  '/images/poojaas/godh-bharai.png',
  '/images/poojaas/kuber-upasana-puja.png',
  '/images/poojaas/birthday-puja.png',
  '/images/poojaas/shuddhikaran-puja.png',
  '/images/poojaas/pind-daan.png',
  '/images/poojaas/pitru-paksha-shradhya-puja.png',
  '/images/poojaas/tripindi-shradhya-puja.png',
  '/images/poojaas/tripindi-shraddha-puja.png',
  '/images/poojaas/bharani-shraddha-puja.png',
  '/images/poojaas/bharani-shradhya-puja.png',
  '/images/poojaas/rin-mukti-puja.png'
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

const createVendorSlug = (vendor) => {
  const fullName = [vendor?.firstName || '', vendor?.lastName || ''].join(' ');
  let slug = fullName
    .toLowerCase()
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/\./g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (!slug) slug = `pandit-${vendor?._id}`;
  return slug;
};

// ─── Default fallback content ──────────────────────────────────────────────────
const DEFAULT_FAQ_DATA = [
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

// ─── Helper: Rich text renderer ───────────────────────────────────────────────
function RichText({ content, variant = 'body2', color = 'text.secondary', sx = {} }) {
  if (!content) return null;

  if (typeof content === 'string') {
    return (
      <Typography variant={variant} color={color} sx={sx}>
        {content}
      </Typography>
    );
  }

  return (
    <Typography variant={variant} color={color} sx={{ ...sx, whiteSpace: 'pre-line' }}>
      {content.map((part, i) => {
        if (typeof part === 'string') return <React.Fragment key={i}>{part}</React.Fragment>;
        if (part?.link) {
          return (
            <a
              key={i}
              href={part.link.href}
              style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline' }}
            >
              {part.link.text}
            </a>
          );
        }
        return null;
      })}
    </Typography>
  );
}

// ─── SEO Content Card Component ────────────────────────────────────────────────
function SeoContentCard({ vendor, slug }) {
  const custom = VENDOR_SEO_CONTENT[slug] || null;

  const experienceLabel =
    custom?.details?.experience ||
    (vendor?.experience ? `${vendor.experience}+ Years` : '25+ Years');

  const seoDetails = [
    { label: 'Experience', value: experienceLabel },
    {
      label: 'Specialization',
      value:
        custom?.details?.specialization ||
        vendor?.specialization ||
        'Grah Shanti, Vastu Puja, Satyanarayan Katha, Griha Pravesh'
    },
    {
      label: 'Services',
      value: custom?.details?.services || 'Multiple Puja & Ritual Services'
    },
    {
      label: 'Availability',
      value: custom?.details?.availability || 'Available for Home Services'
    }
  ];

  const aboutHeading = custom?.about?.heading || 'About Pandit Ji';
  const aboutContent = custom?.about?.content || null;
  const faqData = custom?.faqs || DEFAULT_FAQ_DATA;

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>

        {/* ── About Pandit Ji ── */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
          {aboutHeading}
        </Typography>

        {aboutContent ? (
          <RichText content={aboutContent} variant="body2" color="text.secondary" />
        ) : (
          <>
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
              , he offers trusted and professional home services.
            </Typography>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        {/* ── Additional Details — full width, one below other ── */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Additional Details
        </Typography>
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          {seoDetails.map((item) => (
            <Box
              key={item.label}
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
          ))}
        </Stack>

        {/* Trust Badges removed from here — moved to Profile Card */}

        <Divider sx={{ my: 3 }} />

        {/* ── FAQ Section ── */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
          Frequently Asked Questions
        </Typography>
        <Stack spacing={1}>
          {faqData.map((faq, index) => (
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
  const slug = params.slug;

  const customSeo = VENDOR_SEO_CONTENT[slug] || null;

  const {
    data: vendorData,
    isPending: vendorLoading,
    error: vendorError
  } = useQuery({
    queryKey: ['vendor-profile', slug],
    queryFn: async () => {
      const response = await api.getAllPandit();
      const vendors = response?.payload?.vendors || [];
      const matchedVendor = vendors.find((vendor) => {
        console.log(createVendorSlug(vendor), slug);
        return createVendorSlug(vendor) === slug;
      });
      return { payload: { vendor: matchedVendor } };
    },
    enabled: !!slug
  });

  const vendorId = vendorData?.payload?.vendor?.id;

  const {
    data: servicesData,
    isPending: servicesLoading,
    error: servicesError
  } = useQuery({
    queryKey: ['vendor-services', vendorId],
    queryFn: () => api.getPanditServices(vendorId),
    enabled: !!vendorId
  });

  const vendor = vendorData?.payload?.vendor;
  const services = servicesData?.payload?.services || [];

  const getLocalServiceImageByName = (poojaType = '') => {
    const normalized = normalizeServiceName(poojaType);
    if (LOCAL_SERVICE_IMAGE_BY_NAME[normalized]) return LOCAL_SERVICE_IMAGE_BY_NAME[normalized];
    const found = Object.entries(LOCAL_SERVICE_IMAGE_BY_NAME).find(
      ([key]) => normalized.includes(key) || key.includes(normalized)
    );
    return found ? found[1] : '';
  };

  // ── Loading State ──
  if (vendorLoading) {
    return (
      <Container maxWidth="xl">
        <Stack gap={3}>
          <HeaderBreadcrumbs
            heading="Loading..."
            links={[{ name: 'Home', href: '/' }, { name: 'Pandits', href: '/shops' }]}
          />
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
          <HeaderBreadcrumbs
            heading="Vendor Not Found"
            links={[{ name: 'Home', href: '/' }, { name: 'Pandits', href: '/shops' }]}
          />
          <Typography variant="h3" color="error.main" textAlign="center">
            Vendor not found
          </Typography>
        </Stack>
      </Container>
    );
  }

  const pageHeading = customSeo?.h1 || `${vendor.firstName} ${vendor.lastName}`;

  return (
    <Container maxWidth="xl">
      <Stack gap={3}>
        <HeaderBreadcrumbs
          heading={pageHeading}
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

                  {/* <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Gotra:</strong>{' '}
                    <Typography component="span" color="text.secondary">
                      {vendor?.gotra || '-'}
                    </Typography>
                  </Typography> */}

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

                  {/* ── Trust Badges — below Languages ── */}
                  <Stack direction="row" sx={{ mt: 2, justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
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

                </CardContent>
              </Card>

              {/* Pandit Ji Details Card
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
              </Card> */}

              {/* Pandit Ji Details Card */}
              <Card>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    Pandit Ji Details
                  </Typography>

                  {vendor.gotra && (
                    <Box
                      sx={{
                        background: '#EEEDFE',
                        border: '1.5px solid #AFA9EC',
                        borderRadius: 3,
                        px: 2,
                        py: 1.5,
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: '#534AB7', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
                      >
                        Gotra
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#26215C', fontWeight: 500 }}>
                        {vendor.gotra}
                      </Typography>
                    </Box>
                  )}

                  <Grid container spacing={1.5}>
                    {vendor.veda && (
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, px: 1.5, py: 1 }}>
                          <Typography variant="caption" color="text.secondary">Veda</Typography>
                          <Typography variant="body2" fontWeight={500}>{vendor.veda}</Typography>
                        </Box>
                      </Grid>
                    )}
                    {vendor.shakha && (
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, px: 1.5, py: 1 }}>
                          <Typography variant="caption" color="text.secondary">Shakha</Typography>
                          <Typography variant="body2" fontWeight={500}>{vendor.shakha}</Typography>
                        </Box>
                      </Grid>
                    )}
                    {vendor.pankti && (
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, px: 1.5, py: 1 }}>
                          <Typography variant="caption" color="text.secondary">Pankti</Typography>
                          <Typography variant="body2" fontWeight={500}>{vendor.pankti}</Typography>
                        </Box>
                      </Grid>
                    )}
                    {vendor.sutra && (
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, px: 1.5, py: 1 }}>
                          <Typography variant="caption" color="text.secondary">Sutra</Typography>
                          <Typography variant="body2" fontWeight={500}>{vendor.sutra}</Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>

              {/* SEO Content Card */}
              <SeoContentCard vendor={vendor} slug={slug} />

            </Stack>
          </Grid>

          {/* ── RIGHT COLUMN ── */}
          <Grid size={{ lg: 8, md: 12 }}>
            <Stack spacing={3}>

              {/* About Section */}
              <Card>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    {customSeo?.intro?.heading || 'About Pandit Ji'}
                  </Typography>
                  {customSeo?.intro?.content ? (
                    <RichText content={customSeo.intro.content} variant="body1" color="text.secondary" />
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      {vendor.about || 'Experienced pandit offering authentic pooja services with traditional rituals and modern convenience.'}
                    </Typography>
                  )}
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
                          <Grid key={service._id || service.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <PoojaCard
                              isLoading={false}
                              singleAction
                              actionLabel="View Details & Book"
                              actionUrl={`/${slug}/services/${service._id || service.id}`}
                              service={{
                                id: service._id || service.id,
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