'use client';
import Link from 'next/link';
import PropTypes from 'prop-types';

// mui
import { styled } from '@mui/material/styles';
import { Box, Typography, Container, Card, Skeleton, Stack, alpha } from '@mui/material';
// components
// icons
import { IoIosArrowForward } from 'react-icons/io';
import BlurImageAvatar from '@/components/avatar';

const RootStyle = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  height: 300,
  position: 'relative',
  overflow: 'hidden',
  borderWidth: 0,
  borderBottomWidth: 1,
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

const InfoStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  bottom: '35px !important',
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3)
  }
}));

const CoverImgStyle = styled('div')({
  zIndex: 8,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

export default function ShopDetailCover({ data, isLoading, isUser, page }) {
  return (
    <RootStyle>
      <div>
        <Container maxWidth="xl">
          <InfoStyle>
            <BlurImageAvatar
              src={data?.logo?.url || '/images/default-shop.png'}
              alt={data?.name || 'Pandit photo'}
              sx={{
                mx: 'auto',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: 'common.white',
                width: { xs: 80, md: 128 },
                height: { xs: 80, md: 128 },
                boxShadow: (theme) => `inset -1px 1px 2px ${alpha(theme.palette.common.black, 0.24)}`
              }}
            />

            <Box
              sx={{
                ml: { md: 3 },
                mt: { xs: 1, md: 0 },
                color: 'common.white',
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              <Typography variant="h4">{isLoading ? <Skeleton variant="text" width={220} /> : data?.name}</Typography>
              {isUser ? (
                <Stack direction="row" alignItems="center" justifyContent="end" spacing={0.5}>
                  <Typography variant="body1" component={Link} href="/" color="common.white">
                    Home
                  </Typography>
                  <IoIosArrowForward size={12} />
                  <Typography
                    variant="body1"
                    component={Link}
                    href={page}
                    color="common.white"
                    sx={{
                      textTransform: 'capitalize'
                    }}
                  >
                    {page}
                  </Typography>
                  <IoIosArrowForward size={12} />
                  <Typography variant="body1">{data?.name}</Typography>
                </Stack>
              ) : (
                <Typography variant="body1">
                  {isLoading ? <Skeleton variant="text" width={220} /> : data?.description}
                </Typography>
              )}
            </Box>
          </InfoStyle>
          <CoverImgStyle />
        </Container>
      </div>
    </RootStyle>
  );
}

// Add PropTypes
ShopDetailCover.propTypes = {
  data: PropTypes.shape({
    cover: PropTypes.shape({
      url: PropTypes.string.isRequired
    }),
    logo: PropTypes.shape({
      url: PropTypes.string.isRequired
    }),

    name: PropTypes.string.isRequired,
    approved: PropTypes.bool,
    approvedAt: PropTypes.bool,
    address: PropTypes.object.isRequired,
    phone: PropTypes.any,
    description: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isUser: PropTypes.bool
};
