'use client';
// react
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from '@bprogress/next';
// mui
import {
  Grid,
  Card,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  Button,
  Skeleton,
  CardContent,
  Box
} from '@mui/material';
import PhoneInputField from 'src/components/phone-input-field';
// component
import UploadAvatar from '@/components/upload/upload-avatar';
import countries from 'src/data/countries.json';
// api
import * as api from 'src/services';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
// redux
import { useDispatch } from 'react-redux';
import { signIn } from 'src/redux/slices/user';

import { useUploadSingleFile } from '@/hooks/use-upload-file';
import { profileSchema } from '@/validations';

export default function GeneralProfileForm({ user, isLoading }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const { mutate, isPending: updateLoading } = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: (res) => {
      dispatch(signIn(res.data));
      toast.success('Updated profile');
    }
  });

  const { mutateAsync: deleteMutate, isPending: deleteLoading } = useMutation({
    mutationFn: api.singleDeleteFile,
    onSuccess: () => {},
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  });

  const { mutate: uploadMutate, isPending: avatarLoading } = useUploadSingleFile(
    async (data) => {
      // onSuccess

      // delete previous if exists
      if (Boolean(values.cover?._id)) {
        await deleteMutate(values.cover._id);
      }
      setFieldValue('cover', { _id: data.public_id, url: data.secure_url });
      toast.success('Image Uploaded');
    },
    (error) => {
      console.error(error);
      toast.error(error.message);
    }
  );

  const { mutate: ResendOTPMutate } = useMutation({
    mutationFn: api.resendOTP,
    retry: false,
    onSuccess: async () => {
      toast.success('OTP resent');
      setVerifyLoading(false);
      router.push('/auth/verify-otp');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Invalid OTP.');
      setVerifyLoading(false);
    }
  });

  const [verifyLoading, setVerifyLoading] = React.useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      gender: user?.gender || '',
      about: user?.about || '',
      cover: user?.cover,
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      country: user?.country || 'Andorra',
      zip: user?.zip || '',
      gotra: user?.gotra || '',
      veda: user?.veda || '',
      pankti: user?.pankti || '',
      shakha: user?.shakha || '',
      language: user?.language || []
    },

    validationSchema: profileSchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      mutate({ ...rest });
    }
  });

  const { values, errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;

  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    uploadMutate({
      file
    });
  };

  const onVerifyAccount = () => {
    setVerifyLoading(true);
    ResendOTPMutate({ email: user.email });
  };
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ md: 4, xs: 12 }}>
            <Card sx={{ py: 5, textAlign: 'center' }}>
              <CardContent>
                {isLoading || avatarLoading || deleteLoading ? (
                  <Stack alignItems="center">
                    <Skeleton variant="circular" width={142} height={142} />
                    <Skeleton variant="text" width={150} sx={{ mt: 1 }} />
                  </Stack>
                ) : (
                  <UploadAvatar
                    accept="image/*"
                    file={values.cover?.url || ''}
                    loading={avatarLoading || deleteLoading}
                    maxSize={3145728}
                    onDrop={handleDrop}
                    error={Boolean(touched.cover?.url && errors.cover?.url)}
                    caption={
                      <>
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 2,
                            mx: 'auto',
                            display: 'block',
                            textAlign: 'center',
                            color: 'text.secondary',
                            mb: 1,
                            position: 'relative',
                            cursor: 'pointer'
                          }}
                        >
                          Allowed *.jpeg, *.jpg, *.png, *.gif
                        </Typography>
                      </>
                    }
                  />
                )}
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.photoURL && errors.photoURL}
                </FormHelperText>
                {isLoading || user?.isVerified ? (
                  ''
                ) : (
                  <Button loading={verifyLoading} variant="text" color="primary" onClick={onVerifyAccount}>
                    Verify Account
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ md: 8, xs: 12 }}>
            <Card>
              <CardContent>
                <Stack spacing={{ xs: 2 }}>
                  {/* First + Last Name */}
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    {/* First Name */}
                    <Stack spacing={0.5} width={1}>
                      <Typography variant="overline" color="text.primary">
                        {isLoading ? <Skeleton variant="text" width={120} /> : 'First Name'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" height={56} />
                      ) : (
                        <TextField
                          id="first-name"
                          fullWidth
                          {...getFieldProps('firstName')}
                          error={Boolean(touched.firstName && errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                        />
                      )}
                    </Stack>

                    {/* Last Name */}
                    <Stack spacing={0.5} width={1}>
                      <Typography variant="overline" color="text.primary">
                        {isLoading ? <Skeleton variant="text" width={120} /> : 'Last Name'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" height={56} />
                      ) : (
                        <TextField
                          id="last-name"
                          fullWidth
                          {...getFieldProps('lastName')}
                          error={Boolean(touched.lastName && errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                        />
                      )}
                    </Stack>
                  </Stack>
                  {/* Phone + Gender */}
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    {/* Phone */}
                    <Stack spacing={0.5} width={1}>
                      <Typography variant="overline" color="text.primary">
                        {isLoading ? <Skeleton variant="text" width={120} /> : 'Phone'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" height={56} />
                      ) : (
                        <PhoneInputField
                          error={errors?.phone}
                          onChange={(val) => setFieldValue('phone', val)}
                          value={values.phone}
                        />
                      )}
                    </Stack>

                    {/* Gender */}
                    <Stack spacing={0.5} width={1}>
                      <Typography variant="overline" color="text.primary">
                        {isLoading ? <Skeleton variant="text" width={120} /> : 'Gender'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" height={56} />
                      ) : (
                        <TextField
                          select
                          fullWidth
                          id="gender"
                          placeholder="Gender"
                          {...getFieldProps('gender')}
                          SelectProps={{ native: true }}
                          error={Boolean(touched.gender && errors.gender)}
                          helperText={touched.gender && errors.gender}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </TextField>
                      )}
                    </Stack>
                  </Stack>
                  {/* Address */}
                  <Stack spacing={0.5} width={1}>
                    <Typography variant="overline" color="text.primary">
                      {isLoading ? <Skeleton variant="text" width={120} /> : 'Address'}
                    </Typography>
                    {isLoading ? (
                      <Skeleton variant="rounded" height={56} />
                    ) : (
                      <TextField
                        id="address"
                        fullWidth
                        {...getFieldProps('address')}
                        error={Boolean(touched.address && errors.address)}
                        helperText={touched.address && errors.address}
                      />
                    )}
                  </Stack>
                  {/* Country */}
                  <Stack spacing={0.5} width={1}>
                    <Typography variant="overline" color="text.primary">
                      {isLoading ? <Skeleton variant="text" width={120} /> : 'Country'}
                    </Typography>
                    {isLoading ? (
                      <Skeleton variant="rounded" height={56} />
                    ) : (
                      <TextField
                        id="country"
                        select
                        fullWidth
                        placeholder="Country"
                        {...getFieldProps('country')}
                        SelectProps={{ native: true }}
                        error={Boolean(touched.country && errors.country)}
                        helperText={touched.country && errors.country}
                      >
                        {countries.map((option) => (
                          <option key={option.code} value={option.label}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    )}
                  </Stack>
                  {/* City, State, Zip */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    {/* City */}
                    <Stack spacing={0.5} width={1}>
                      <Typography variant="overline" color="text.primary">
                        {isLoading ? <Skeleton variant="text" width={120} /> : 'Town City'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" height={56} />
                      ) : (
                        <TextField
                          id="city"
                          fullWidth
                          {...getFieldProps('city')}
                          error={Boolean(touched.city && errors.city)}
                          helperText={touched.city && errors.city}
                        />
                      )}
                    </Stack>

                    {/* State */}
                    <Stack spacing={0.5} width={1}>
                      <Typography variant="overline" color="text.primary">
                        {isLoading ? <Skeleton variant="text" width={120} /> : 'State'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" height={56} />
                      ) : (
                        <TextField
                          id="state"
                          fullWidth
                          {...getFieldProps('state')}
                          error={Boolean(touched.state && errors.state)}
                          helperText={touched.state && errors.state}
                        />
                      )}
                    </Stack>
                    <Stack spacing={0.5} width={1}>
                      <Typography variant="overline" color="text.primary">
                        {isLoading ? <Skeleton variant="text" width={120} /> : 'Zip/Postal Code'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" height={56} />
                      ) : (
                        <TextField
                          fullWidth
                          {...getFieldProps('zip')}
                          error={Boolean(touched.zip && errors.zip)}
                          helperText={touched.zip && errors.zip}
                          type="number"
                        />
                      )}
                    </Stack>
                  </Stack>
                  {/* About */}
                  <Stack spacing={0.5} width={1}>
                    <Typography variant="overline" color="text.primary">
                      {isLoading ? <Skeleton variant="text" width={120} /> : 'About'}
                    </Typography>
                    {isLoading ? (
                      <Skeleton variant="rounded" height={100} />
                    ) : (
                      <TextField {...getFieldProps('about')} fullWidth multiline minRows={4} maxRows={4} id="about" />
                    )}
                  </Stack>

                  {/* Vendor-specific fields */}
                  {user?.role === 'vendor' && (
                    <>
                      {/* Gotra, Veda */}
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        {/* Gotra */}
                        <Stack spacing={0.5} width={1}>
                          <Typography variant="overline" color="text.primary">
                            {isLoading ? <Skeleton variant="text" width={120} /> : 'Gotra'}
                          </Typography>
                          {isLoading ? (
                            <Skeleton variant="rounded" height={56} />
                          ) : (
                            <TextField
                              id="gotra"
                              fullWidth
                              {...getFieldProps('gotra')}
                              error={Boolean(touched.gotra && errors.gotra)}
                              helperText={touched.gotra && errors.gotra}
                            />
                          )}
                        </Stack>

                        {/* Veda */}
                        <Stack spacing={0.5} width={1}>
                          <Typography variant="overline" color="text.primary">
                            {isLoading ? <Skeleton variant="text" width={120} /> : 'Veda'}
                          </Typography>
                          {isLoading ? (
                            <Skeleton variant="rounded" height={56} />
                          ) : (
                            <TextField
                              id="veda"
                              fullWidth
                              {...getFieldProps('veda')}
                              error={Boolean(touched.veda && errors.veda)}
                              helperText={touched.veda && errors.veda}
                            />
                          )}
                        </Stack>
                      </Stack>

                      {/* Pankti, Shakha */}
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        {/* Pankti */}
                        <Stack spacing={0.5} width={1}>
                          <Typography variant="overline" color="text.primary">
                            {isLoading ? <Skeleton variant="text" width={120} /> : 'Pankti'}
                          </Typography>
                          {isLoading ? (
                            <Skeleton variant="rounded" height={56} />
                          ) : (
                            <TextField
                              id="pankti"
                              fullWidth
                              {...getFieldProps('pankti')}
                              error={Boolean(touched.pankti && errors.pankti)}
                              helperText={touched.pankti && errors.pankti}
                            />
                          )}
                        </Stack>

                        {/* Shakha */}
                        <Stack spacing={0.5} width={1}>
                          <Typography variant="overline" color="text.primary">
                            {isLoading ? <Skeleton variant="text" width={120} /> : 'Shakha'}
                          </Typography>
                          {isLoading ? (
                            <Skeleton variant="rounded" height={56} />
                          ) : (
                            <TextField
                              id="shakha"
                              fullWidth
                              {...getFieldProps('shakha')}
                              error={Boolean(touched.shakha && errors.shakha)}
                              helperText={touched.shakha && errors.shakha}
                            />
                          )}
                        </Stack>
                      </Stack>

                      {/* Sutra */}
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Stack spacing={0.5} width={1}>
                          <Typography variant="overline" color="text.primary">
                            {isLoading ? <Skeleton variant="text" width={120} /> : 'Sutra'}
                          </Typography>
                          {isLoading ? (
                            <Skeleton variant="rounded" height={56} />
                          ) : (
                            <TextField
                              id="sutra"
                              fullWidth
                              {...getFieldProps('sutra')}
                              error={Boolean(touched.sutra && errors.sutra)}
                              helperText={touched.sutra && errors.sutra}
                            />
                          )}
                        </Stack>
                      </Stack>
                    </>
                  )}

                  <Stack alignItems="end"></Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          {/* Save button */}
          <Box sx={{ ml: 'auto' }}>
            {isLoading ? (
              <Skeleton height={56} width={81} variant="rounded" />
            ) : (
              <Button type="submit" variant="contained" size="large" loading={updateLoading || avatarLoading}>
                Save Setting
              </Button>
            )}
          </Box>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
