'use client';
import React from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useRouter } from '@bprogress/next';

import { Form, FormikProvider, useFormik } from 'formik';

import { 
  Card, 
  Stack, 
  CardHeader, 
  CardContent, 
  Button, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Skeleton
} from '@mui/material';
// api
import * as api from 'src/services';
import { useMutation, useQuery } from '@tanstack/react-query';

// Pooja types from the Service model
const POOJA_TYPES = [
  "Rudrabhishek Puja",
  "Satyanarayan Puja",
  "Mool Puja",
  "Bhoomi Neev Puja",
  "Griha Pravesh Puja",
  "Griha Vastu Shanti Puja",
  "Namkaran Puja",
  "Annaprashan Sanskar Puja",
  "Navratri Puja",
  "Dhanteras Puja",
  "Diwali Puja",
  "Engagement Puja",
  "Tilak Puja",
  "Vivah Puja",
  "Sunderkand Path",
  "Saraswati Puja",
  "Vishwakarma Puja",
  "Krishna Janmashtami Puja",
  "Hanuman Janmotsav",
  "Ram Navami Puja",
  "Akshaya Tritiya Puja",
  "Holika Puja",
  "Govardhan Puja",
  "Mahalakshmi Puja",
  "Haritalika Teej Vrat Puja",
  "Navagraha Shanti Puja",
  "Budh (Mercury) Graha Shanti Puja",
  "Shukra (Venus) Graha Shanti Puja",
  "Chandra (Moon) Graha Shanti Puja",
  "Brihaspati (Jupiter) Graha Shanti Puja",
  "Surya (Sun) Graha Shanti Puja",
  "Mangal (Mars) Graha Shanti Puja",
  "Rahu Graha Shanti Puja",
  "Ketu Graha Shanti Puja",
  "Shani Graha Shanti Puja",
  "Pitru Dosh Nivaran Puja",
  "Santan Gopal Mantra Chant",
  "Kalsarp Dosh Nivaran Puja",
  "Ganesh Puja",
  "Janeu, Yajnopaveet (Upanayana Sanskar)",
  "Business Opening Puja",
  "Manglik Dosha Nivaran Puja (KumbhArk Marriage)",
  "Shanti Puja (Poorvajon ke lie)",
  "Marriage Anniversary Puja",
  "Varshik Shradh Puja",
  "Godh Bharai",
  "Kubera Upasana Puja",
  "Birthday Puja",
  "Shuddhikaran Puja",
  "Pind Daan",
  "Pitru Paksha Shraddha Puja",
  "Tripindi Shraddha Puja",
  "Bharani Shraddha Puja",
  "Rin Mukti Puja",
  "Others"
];

// Price mapping for Pooja types
const POOJA_PRICE_MAP = {
  "Rudrabhishek Puja": 5100,
  "Satyanarayan Puja": 2100,
  "Mool Puja": 5100,
  "Bhoomi Neev Puja": 2100,
  "Griha Pravesh Puja": 5100,
  "Griha Vastu Shanti Puja": 5100,
  "Namkaran Puja": 3100,
  "Annaprashan Sanskar Puja": 2100,
  "Navratri Puja": 3100,
  "Dhanteras Puja": 2100,
  "Diwali Puja": 3100,
  "Engagement Puja": 3100,
  "Tilak Puja": 3100,
  "Vivah Puja": 21000,
  "Sunderkand Path": 1100,
  "Saraswati Puja": 1100,
  "Vishwakarma Puja": 1100,
  "Krishna Janmashtami Puja": 2100,
  "Hanuman Janmotsav": 2100,
  "Ram Navami Puja": 2100,
  "Akshaya Tritiya Puja": 2100,
  "Holika Puja": 2100,
  "Govardhan Puja": 2100,
  "Mahalakshmi Puja": 1100,
  "Haritalika Teej Vrat Puja": 2100,
  "Navagraha Shanti Puja": 5100,
  "Budh (Mercury) Graha Shanti Puja": 5100,
  "Shukra (Venus) Graha Shanti Puja": 5100,
  "Chandra (Moon) Graha Shanti Puja": 5100,
  "Brihaspati (Jupiter) Graha Shanti Puja": 5100,
  "Surya (Sun) Graha Shanti Puja": 5100,
  "Mangal (Mars) Graha Shanti Puja": 5100,
  "Rahu Graha Shanti Puja": 5100,
  "Ketu Graha Shanti Puja": 5100,
  "Shani Graha Shanti Puja": 5100,
  "Pitru Dosh Nivaran Puja": 11000,
  "Santan Gopal Mantra Chant": 5100,
  "Kalsarp Dosh Nivaran Puja": 11000,
  "Ganesh Puja": 2100,
  "Janeu, Yajnopaveet (Upanayana Sanskar)": 5100,
  "Business Opening Puja": 5100,
  "Manglik Dosha Nivaran Puja (KumbhArk Marriage)": 21000,
  "Shanti Puja (Poorvajon ke lie)": 11000,
  "Marriage Anniversary Puja": 2100,
  "Varshik Shradh Puja": 3100,
  "Godh Bharai": 5100,
  "Kubera Upasana Puja": 11000,
  "Birthday Puja": 2100,
  "Shuddhikaran Puja": 5100,
  "Pind Daan": 5100,
  "Pitru Paksha Shraddha Puja": 5100,
  "Tripindi Shraddha Puja": 5100,
  "Bharani Shraddha Puja": 5100,
  "Rin Mukti Puja": 5100,
  "Others": 2100
};

const DURATION_OPTIONS = [
  "1-2 Hour",
  "2-3 Hours",
  "3-4 Hours", 
  "4-5 Hours",
  "4-6 Hours",
  "Custom"
];

export default function ServiceForm({
  currentService,
  isLoading,
  isVendor
}) {
  const router = useRouter();

  // Fetch vendors for admin
  const { data: vendorsData } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => api.getVendorsByAdmin(),
    enabled: !isVendor
  });

  const vendors = vendorsData?.data || [];

  const { mutate: createService, isPending: isCreating } = useMutation({
    mutationFn: isVendor ? api.createServiceByVendor : api.createServiceByAdmin,
    onSuccess: () => {
      toast.success('Pooja service created successfully!');
      router.push(isVendor ? '/vendor/services' : '/admin/services');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create service');
    }
  });

  const { mutate: updateService, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, ...data }) => isVendor 
      ? api.updateServiceByVendor({ id, ...data })
      : api.updateServiceByAdmin({ id, ...data }),
    onSuccess: () => {
      toast.success('Pooja service updated successfully!');
      router.push(isVendor ? '/vendor/services' : '/admin/services');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update service');
    }
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      poojaType: currentService?.poojaType || '',
      description: currentService?.description || '',
      duration: currentService?.duration || '',
      price: currentService?.price || '',
      vendor: currentService?.vendor?._id || currentService?.vendor || ''
    },
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          price: parseFloat(values.price)
        };

        if (currentService) {
          updateService({ id: currentService._id, ...payload });
        } else {
          createService(payload);
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { handleSubmit, values, errors, touched, setFieldValue, getFieldProps } = formik;

  // Handle Pooja Type change and auto-populate price
  const handlePoojaTypeChange = (event) => {
    const selectedPoojaType = event.target.value;
    
    // Update poojaType field
    setFieldValue('poojaType', selectedPoojaType);
    
    // Auto-populate price if mapping exists
    if (selectedPoojaType && POOJA_PRICE_MAP[selectedPoojaType]) {
      setFieldValue('price', POOJA_PRICE_MAP[selectedPoojaType]);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader title={<Skeleton variant="text" width={200} />} />
        <CardContent>
          <Stack spacing={3}>
            <Skeleton variant="rectangular" height={56} />
            <Skeleton variant="rectangular" height={56} />
            <Skeleton variant="rectangular" height={56} />
            <Skeleton variant="rectangular" height={100} />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Card>
          <CardHeader title={currentService ? 'Edit Pandit Ji Service' : 'Add Pandit Ji Service'} />
          <CardContent>
            <Stack spacing={3}>
              {!isVendor && (
                <FormControl fullWidth error={Boolean(touched.vendor && errors.vendor)}>
                  <InputLabel>Vendor</InputLabel>
                  <Select
                    {...getFieldProps('vendor')}
                    label="Vendor"
                  >
                    {vendors.map((vendor) => (
                      <MenuItem key={vendor._id} value={vendor._id}>
                        {vendor.firstName} {vendor.lastName} ({vendor.email})
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.vendor && errors.vendor && (
                    <FormHelperText>{errors.vendor}</FormHelperText>
                  )}
                </FormControl>
              )}

              <FormControl fullWidth error={Boolean(touched.poojaType && errors.poojaType)}>
                <InputLabel>Pooja Type</InputLabel>
                <Select
                  {...getFieldProps('poojaType')}
                  label="Pooja Type"
                  onChange={handlePoojaTypeChange}
                >
                  {POOJA_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {touched.poojaType && errors.poojaType && (
                  <FormHelperText>{errors.poojaType}</FormHelperText>
                )}
              </FormControl>

              <TextField
                {...getFieldProps('price')}
                fullWidth
                label="Price (₹)"
                type="number"
                error={Boolean(touched.price && errors.price)}
                helperText={touched.price && errors.price}
                placeholder="Enter price"
              />

              <FormControl fullWidth error={Boolean(touched.duration && errors.duration)}>
                <InputLabel>Duration</InputLabel>
                <Select
                  {...getFieldProps('duration')}
                  label="Duration"
                >
                  {DURATION_OPTIONS.map((duration) => (
                    <MenuItem key={duration} value={duration}>
                      {duration}
                    </MenuItem>
                  ))}
                </Select>
                {touched.duration && errors.duration && (
                  <FormHelperText>{errors.duration}</FormHelperText>
                )}
              </FormControl>

              <TextField
                {...getFieldProps('description')}
                fullWidth
                multiline
                rows={4}
                label="Description"
                error={Boolean(touched.description && errors.description)}
                helperText={touched.description && errors.description}
                placeholder="Enter service description"
              />

              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => router.push('/vendor/services')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating ? 'Processing...' : (currentService ? 'Update Service' : 'Create Service')}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Form>
    </FormikProvider>
  );
}

ServiceForm.propTypes = {
  currentService: PropTypes.object,
  isLoading: PropTypes.bool,
  isVendor: PropTypes.bool
};

