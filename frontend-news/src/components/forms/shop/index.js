'use client';

import * as React from 'react';
import { useState } from 'react';

import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Button,
  FormHelperText,
  Skeleton,
  FormControl,
  Typography,
  Select,
  TextField
} from '@mui/material';

import { Form, FormikProvider, useFormik } from 'formik';
import { useRouter } from '@bprogress/next';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import ShopDetailsForm from '@/components/forms/shop/shop-details';
import { updateUserRole } from '@/redux/slices/user';
import * as api from 'src/services';
import IdentityVerificationForm from '@/components/forms/shop/identity-verification';
import FinancialDetailsForm from '@/components/forms/shop/financial-details';
import { useUploadSingleFile } from '@/hooks/use-upload-file';
import { shopSettingsSchema } from '@/validations';

const STATUS_OPTIONS = ['pending', 'approved', 'in review', 'action required', 'cancel', 'closed'];
export default function ShopForm({ isShopLoading, shop, type }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isCreatingShop = type === 'create-shop';
  const isVendor = type === 'vendor';
  const isAdmin = type === 'admin';
  const [state, setstate] = useState({
    logoLoading: false,
    governmentIdLoading: false,
    proofOfAddressLoading: false,
    vendorAgreementLoading: false,
    name: '',
    search: '',
    open: false
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: isAdmin ? api.updateShopByAdmin : isVendor ? api.updateShopByVendor : api.addShopByUser,
    retry: false,
    onSuccess: () => {
      if (isCreatingShop) {
        toast.success('Pandit profile is under review!');
        dispatch(updateUserRole());
        router.push('/vendor/dashboard');
      } else if (isAdmin) {
        toast.success('Pandit profile updated!');
        router.push('/admin/shops');
      } else {
        router.push('/vendor/shops');
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  });
  // ✅ use mutateAsync for delete
  const { mutateAsync: deleteMutate } = useMutation({
    mutationFn: api.singleDeleteFile,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  });

  const { mutate: uploadMutate } = useUploadSingleFile(
    async (data, variables) => {
      const { field } = variables; // ✅ comes from mutate({..., field})
      const split = field.split('.');

      // delete previous if exists
      let prevId;
      if (split.length > 1) {
        prevId = values[split[0]]?.[split[1]]?._id;
      } else {
        prevId = values[field]?._id;
      }

      if (prevId) {
        await deleteMutate(prevId);
      }

      setFieldValue(field, { _id: data.public_id, url: data.secure_url });

      // ✅ functional update to avoid reset
      setstate((prev) => ({
        ...prev,
        [`${split.length > 1 ? split[1] : split[0]}Loading`]: false
      }));
    },
    (error, variables) => {
      console.error(error);
      const { field } = variables;
      const split = field.split('.');

      setstate((prev) => ({
        ...prev,
        [`${split.length > 1 ? split[1] : split[0]}Loading`]: false
      }));
    }
  );
  const handleDrop = (acceptedFiles, field) => {
    const file = acceptedFiles[0];
    if (!file) return;

    Object.assign(file, { preview: URL.createObjectURL(file) });

    const split = field.split('.');
    uploadMutate({
      file,
      config: {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentage = Math.floor((loaded * 100) / total);

          // ✅ use functional update so we don’t reset state accidentally
          setstate((prev) => ({
            ...prev,
            [`${split.length > 1 ? split[1] : split[0]}Loading`]: percentage
          }));
        }
      },
      field
    });
  };

  const formik = useFormik({
    initialValues: {
      logo: isCreatingShop ? null : shop?.logo,
      name: isCreatingShop ? '' : (shop?.name ?? ''),
      slug: isCreatingShop ? '' : (shop?.slug ?? ''),
      metaTitle: isCreatingShop ? '' : (shop?.metaTitle ?? ''),
      description: isCreatingShop ? '' : (shop?.description ?? ''),
      metaDescription: isCreatingShop ? '' : (shop?.metaDescription ?? ''),
      registrationNumber: isCreatingShop ? '' : (shop?.registrationNumber ?? ''),
      address: {
        country: isCreatingShop ? '' : (shop?.address?.country ?? ''),
        city: isCreatingShop ? '' : (shop?.address?.city ?? ''),
        state: isCreatingShop ? '' : (shop?.address?.state ?? ''),
        streetAddress: isCreatingShop ? '' : (shop?.address?.streetAddress ?? '')
      },
      contactPerson: isCreatingShop ? '' : (shop?.contactPerson ?? ''),
      shopEmail: isCreatingShop ? '' : (shop?.shopEmail ?? ''),
      shopPhone: isCreatingShop ? '' : (shop?.shopPhone ?? ''),
      website: isCreatingShop ? '' : (shop?.website ?? ''),

      taxIdentificationNumber: isCreatingShop ? '' : (shop?.taxIdentificationNumber ?? ''),
      vatRegistrationNumber: isCreatingShop ? '' : (shop?.vatRegistrationNumber ?? ''),

      identityVerification: {
        governmentId: isCreatingShop ? null : (shop?.identityVerification?.governmentId ?? null),
        proofOfAddress: isCreatingShop ? null : (shop?.identityVerification?.proofOfAddress ?? null)
      },
      financialDetails: isVendor
        ? {
            paymentMethod: shop?.financialDetails?.paymentMethod ?? 'paypal',
            paypal: {
              email: shop?.financialDetails?.paypal?.email ?? ''
            },
            bank: {
              accountNumber: shop?.financialDetails?.bank?.accountNumber ?? '',
              bankName: shop?.financialDetails?.bank?.bankName ?? '',
              holderName: shop?.financialDetails?.bank?.holderName ?? '',
              holderEmail: shop?.financialDetails?.bank?.holderEmail ?? '',
              address: shop?.financialDetails?.bank?.address ?? '',
              routingNumber: shop?.financialDetails?.bank?.routingNumber ?? '',
              swiftCode: shop?.financialDetails?.bank?.swiftCode ?? ''
            }
          }
        : undefined,

      ...(isAdmin && {
        status: shop ? shop.status : STATUS_OPTIONS[0], // Only include message if shop exists
        message:
          shop?.status === 'cancel' || shop?.status === 'closed' || shop?.status === 'action required'
            ? shop.message
            : ''
      })
    },
    enableReinitialize: true,
    validationSchema: shopSettingsSchema,
    onSubmit: async (values) => {
      const { ...rest } = values;

      try {
        mutate({
          ...(!isCreatingShop && {
            currentSlug: shop?.slug
          }),
          ...rest
        });
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { setFieldValue, handleSubmit, values, touched, errors, getFieldProps } = formik;

  const handleNameChange = (event) => {
    const title = event.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]+/g, '')
      .replace(/\s+/g, '-'); // convert to lowercase, remove special characters, and replace spaces with hyphens
    formik.setFieldValue('slug', slug); // set the value of slug in the formik state
    formik.handleChange(event); // handle the change in formik
  };
  React.useEffect(() => {
    if (values.status === 'approved' || values.status === 'pending' || values.status === 'in review') {
      setFieldValue('message', ''); // Set message to empty string
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.status]);
  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid
            size={{
              md: 8
            }}
          >
            <Card>
              <CardHeader
                title={<>{isShopLoading ? <Skeleton variant="text" height={28} width={240} /> : 'Pandit details'}</>}
              />

              <CardContent>
                <ShopDetailsForm
                  isLoading={isShopLoading}
                  handleDrop={handleDrop}
                  handleNameChange={handleNameChange}
                  state={state}
                  formik={formik}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid
            size={{
              md: 4
            }}
          >
            <Stack gap={2}>
              <Card>
                <CardHeader
                  title={
                    <>{isShopLoading ? <Skeleton variant="text" height={28} width={240} /> : 'Identity Verification'}</>
                  }
                />
                <CardContent>
                  <IdentityVerificationForm
                    isLoading={isShopLoading}
                    handleDrop={handleDrop}
                    handleNameChange={handleNameChange}
                    state={state}
                    formik={formik}
                  />
                </CardContent>
              </Card>
              {isVendor && (
                <Card>
                  <CardHeader
                    title={
                      <>{isShopLoading ? <Skeleton variant="text" height={28} width={240} /> : 'Financial Details'}</>
                    }
                  />
                  <CardContent>
                    <FinancialDetailsForm isLoading={isShopLoading} state={state} formik={formik} />
                  </CardContent>
                </Card>
              )}
              {isAdmin && (
                <Card>
                  <CardContent>
                    <Stack spacing={2}>
                      <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                        <Stack gap={1}>
                          {isShopLoading ? (
                            <Skeleton variant="text" width={70} />
                          ) : (
                            <Typography variant="overline" component={'label'} htmlFor="status">
                              Status
                            </Typography>
                          )}
                          {isShopLoading ? (
                            <Skeleton variant="rectangular" width="100%" height={56} />
                          ) : (
                            <Select
                              id="status"
                              native
                              {...getFieldProps('status')}
                              error={Boolean(touched.status && errors.status)}
                            >
                              <option value="" style={{ display: 'none' }} />
                              {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </Select>
                          )}
                        </Stack>
                        {touched.status && errors.status && (
                          <FormHelperText error sx={{ px: 2, mx: 0 }}>
                            {touched.status && errors.status}
                          </FormHelperText>
                        )}
                      </FormControl>
                      {(values.status === 'cancel' ||
                        values.status === 'closed' ||
                        values.status === 'action required') && (
                        <Stack gap={1}>
                          {isShopLoading ? (
                            <Skeleton variant="text" width={150} />
                          ) : (
                            <Typography variant="overline" component={'label'} htmlFor="message">
                              Message
                            </Typography>
                          )}
                          {isShopLoading ? (
                            <Skeleton variant="rectangular" width="100%" height={240} />
                          ) : (
                            <TextField
                              id="message"
                              fullWidth
                              {...getFieldProps('message')}
                              error={Boolean(touched.message && errors.message)}
                              helperText={touched.message && errors.message}
                              rows={4}
                              multiline
                            />
                          )}
                        </Stack>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              )}
              <Button type="submit" variant="contained" fullWidth size="large" loading={isLoading}>
                {isCreatingShop ? 'Create Pandit Profile' : 'Update Pandit Profile'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
