'use client';
import PropTypes from 'prop-types';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

// mui
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack
} from '@mui/material';

// icons
import { MdAccessTime, MdAttachMoney, MdDescription } from 'react-icons/md';

export default function ServiceCard({ service, vendor, onBookService }) {
  const router = useRouter();
  const { isAuthenticated } = useSelector(({ user }) => user);

  const servicePageUrl = `/vendors/${vendor.id}/services/${service.id}`;
  const handleOpenServicePage = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with payment');
      router.push(`/auth/sign-in?redirect=${encodeURIComponent(servicePageUrl)}`);
      return;
    }
    router.push(servicePageUrl);
  };

  return (
    <>
      <Card
        sx={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 3
          }
        }}
        onClick={() => {
          handleOpenServicePage();
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            {service.poojaType}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
            {service.description || 'Traditional pooja service with authentic rituals'}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Chip
              icon={<MdAccessTime size={16} />}
              label={service.duration}
              size="small"
              color="info"
              variant="outlined"
            />
            <Chip label={`₹${service.price}`} size="small" color="success" variant="outlined" />
          </Stack>

          <Button variant="contained" fullWidth size="small" sx={{ borderRadius: 2 }} onClick={handleOpenServicePage}>
            {isAuthenticated ? 'View Details & Book' : 'Login to Book Service'}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.string.isRequired,
    poojaType: PropTypes.string.isRequired,
    description: PropTypes.string,
    duration: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
  }).isRequired,
  vendor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired
  }).isRequired,
  onBookService: PropTypes.func
};
