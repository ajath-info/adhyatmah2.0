'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  IconButton,
  FormHelperText,
  Grid,
  Skeleton
} from '@mui/material';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import UploadSingleFile from '@/components/upload/upload-single-file';
import { toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import * as api from 'src/services';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useUploadSingleFile } from '@/hooks/use-upload-file';
import { homeSettingsSchema } from '@/validations';

export default function HomeSettingsForm({ data: home }) {
  const [uploadLoading, setUploadLoading] = useState({});

  // Initial values
  const initialValues = {
    slides:
      home?.slides?.map((s) => ({
        link: s.link || '',
        image: { _id: s.image._id, url: s.image.url }
      })) || [],
    banner1: {
      link: home?.banner1?.link || '',
      image: home?.banner1?.image || null
    },
    banner2: {
      link: home?.banner2?.link || '',
      image: home?.banner2?.image || null
    },
    banner3: {
      link: home?.banner3?.link || '',
      image: home?.banner3?.image || null
    }
  };

  // Mutation
  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: (data) => api.updateHomeSettingsByAdmin(data),
    onSuccess: () => toast.success('Home settings updated successfully'),
    onError: () => toast.error('Failed to update home settings')
  });

  // Formik
  const formik = useFormik({
    initialValues,
    validationSchema: homeSettingsSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await mutate({
        _id: home._id,
        ...values
      });
    }
  });

  const { values, errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;
  const { mutateAsync: deleteMutate } = useMutation({
    mutationFn: api.singleDeleteFile,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  });
  const { mutate: uploadMutate } = useUploadSingleFile(
    async (data, variables) => {
      const { fileField, index } = variables; // ✅ comes from mutate({..., field})

      const split = fileField.split('.');

      // delete previous if exists

      const prevId = values[split[0]]?.[split[1]]?._id;
      console.log(fileField, values, values[split[0]], 'abbbc');
      if (prevId) {
        await deleteMutate(prevId);
      }

      if (typeof index === 'number') {
        setFieldValue(fileField, { _id: data.public_id, url: data.secure_url });
      } else {
        setFieldValue(fileField, { _id: data.public_id, url: data.secure_url });
      }

      setUploadLoading((prev) => ({ ...prev, [fileField]: false }));
    },
    (error, variables) => {
      console.error(error);
      const { fileField } = variables;
      toast.error('Image upload failed');
      setUploadLoading((prev) => ({ ...prev, [fileField]: false }));
    }
  );

  const handleDrop = async (acceptedFiles, fileField, index) => {
    setUploadLoading((prev) => ({ ...prev, [fileField]: 2 }));

    const file = acceptedFiles[0];
    if (!file) return;

    uploadMutate({
      file,
      config: {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentage = Math.floor((loaded * 100) / total);

          setUploadLoading((prev) => ({ ...prev, [fileField]: percentage }));
        }
      },
      fileField,
      index
    });
  };
  return (
    <FormikProvider value={formik}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Slides Section */}
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Slides</Typography>
                <Button
                  startIcon={<FiPlus />}
                  variant="contained"
                  onClick={() => setFieldValue('slides', [...values.slides, { link: '', image: null }])}
                >
                  Add Slide
                </Button>
              </Stack>
              <FieldArray
                name="slides"
                render={(arrayHelpers) => (
                  <Grid container spacing={2} mt={2}>
                    {values.slides.map((slide, index) => (
                      <Grid size={{ md: 6, xs: 12 }} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Stack spacing={2}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1">Slide {index + 1}</Typography>
                                <IconButton color="error" onClick={() => arrayHelpers.remove(index)}>
                                  <FiTrash2 />
                                </IconButton>
                              </Stack>
                              <Stack gap={1}>
                                <Typography
                                  variant="overline"
                                  color="text.primary"
                                  htmlFor={`slides${index}-link`}
                                  component="label"
                                >
                                  {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Slide link'}
                                </Typography>
                                {isLoading ? (
                                  <Skeleton variant="rounded" width="100%" height={56} />
                                ) : (
                                  <TextField
                                    id={`slides${index}-link`}
                                    {...getFieldProps(`slides[${index}].link`)}
                                    error={Boolean(touched.slides?.[index]?.link && errors.slides?.[index]?.link)}
                                    helperText={touched.slides?.[index]?.link && errors.slides?.[index]?.link}
                                  />
                                )}
                              </Stack>

                              <UploadSingleFile
                                file={slide.image}
                                onDrop={(acceptedFiles) => handleDrop(acceptedFiles, `slides[${index}].image`, index)}
                                accept="image/*"
                                loading={uploadLoading[`slides[${index}].image`]}
                              />
                              {touched.slides?.[index]?.image && errors.slides?.[index]?.image && (
                                <FormHelperText error>
                                  {errors.slides[index].image?._id ||
                                    errors.slides[index].image?.url ||
                                    'Image required'}
                                </FormHelperText>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              />
            </CardContent>
          </Card>

          {/* Banners */}
          <Grid container spacing={2}>
            {/* Banner 1 */}
            <Grid size={{ md: 6, xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Banner 1</Typography>
                  <Stack spacing={2} mt={2}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="banner1-link" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Banner link'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="banner1-link"
                          {...getFieldProps('banner1.link')}
                          error={Boolean(touched.banner1?.link && errors.banner1?.link)}
                          helperText={touched.banner1?.link && errors.banner1?.link}
                        />
                      )}
                    </Stack>

                    <UploadSingleFile
                      file={values.banner1.image}
                      onDrop={(acceptedFiles) => handleDrop(acceptedFiles, 'banner1.image')}
                      accept="image/*"
                      loading={uploadLoading['banner1.image']}
                    />
                    {touched.banner1?.image && errors.banner1?.image && (
                      <FormHelperText error>
                        {errors.banner1.image?._id || errors.banner1.image?.url || 'Image required'}
                      </FormHelperText>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            {/* Banner 2 */}
            <Grid size={{ md: 6, xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Banner 2</Typography>
                  <Stack spacing={2} mt={2}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="banner2link" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Banner link'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="banner2link"
                          {...getFieldProps('banner2.link')}
                          error={Boolean(touched.banner2?.link && errors.banner2?.link)}
                          helperText={touched.banner2?.link && errors.banner2?.link}
                        />
                      )}
                    </Stack>

                    <UploadSingleFile
                      file={values.banner2.image}
                      onDrop={(acceptedFiles) => handleDrop(acceptedFiles, 'banner2.image')}
                      accept="image/*"
                      loading={uploadLoading['banner2.image']}
                    />
                    {touched.banner2?.image && errors.banner2?.image && (
                      <FormHelperText error>
                        {errors.banner2.image?._id || errors.banner2.image?.url || 'Image required'}
                      </FormHelperText>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Banner 3 */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Banner 3</Typography>
                  <Stack spacing={2} mt={2}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="banner3-link" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Banner link'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="banner3-link"
                          {...getFieldProps('banner3.link')}
                          error={Boolean(touched.banner3?.link && errors.banner3?.link)}
                          helperText={touched.banner3?.link && errors.banner3?.link}
                        />
                      )}
                    </Stack>

                    <UploadSingleFile
                      file={values.banner3.image}
                      onDrop={(acceptedFiles) => handleDrop(acceptedFiles, 'banner3.image')}
                      accept="image/*"
                      loading={uploadLoading['banner3.image']}
                    />
                    {touched.banner3?.image && errors.banner3?.image && (
                      <FormHelperText error>
                        {errors.banner3.image?._id || errors.banner3.image?.url || 'Image required'}
                      </FormHelperText>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box textAlign="right">
            <Button type="submit" variant="contained" loading={isLoading}>
              {'Save Changes'}
            </Button>
          </Box>
        </Stack>
      </form>
    </FormikProvider>
  );
}
