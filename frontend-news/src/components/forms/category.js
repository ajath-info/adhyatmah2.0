'use client';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@bprogress/next';
import PropTypes from 'prop-types';

// mui

import {
  Card,
  Stack,
  TextField,
  Typography,
  Box,
  Select,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Skeleton
} from '@mui/material';
// components
import UploadSingleFile from '@/components/upload/upload-single-file';
// toast
import toast from 'react-hot-toast';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
// api
import * as api from 'src/services';
import { useUploadSingleFile } from '@/hooks/use-upload-file';
import { categorySchema } from '@/validations';

CategoryForm.propTypes = { data: PropTypes.object, isLoading: PropTypes.bool };
const STATUS_OPTIONS = ['active', 'inactive'];

export default function CategoryForm({ data: currentCategory, isLoading: categoryLoading }) {
  const router = useRouter();

  const [state, setstate] = useState({ loading: false, name: '', search: '', open: false });

  const mutationFn = currentCategory ? api.updateCategoryByAdmin : api.addCategoryByAdmin;

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn,
    retry: false,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/admin/categories');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  });

  // Delete file mutation
  const { mutateAsync: deleteMutate } = useMutation({
    mutationFn: api.singleDeleteFile,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  });
  const { mutate: uploadMutate } = useUploadSingleFile(
    async (data) => {
      // onSuccess
      setFieldValue('cover', { _id: data.public_id, url: data.secure_url });

      // delete previous if exists
      if (values.cover?._id) {
        await deleteMutate(values.cover._id);
      }

      setstate((prev) => ({ ...prev, loading: false }));
    },
    (error) => {
      console.error(error);
      setstate((prev) => ({ ...prev, loading: false }));
    }
  );

  const formik = useFormik({
    initialValues: {
      name: currentCategory?.name || '',
      metaTitle: currentCategory?.metaTitle || '',
      cover: currentCategory?.cover || null,
      description: currentCategory?.description || '',
      metaDescription: currentCategory?.metaDescription || '',

      slug: currentCategory?.slug || '',
      status: currentCategory?.status || STATUS_OPTIONS[0]
    },
    enableReinitialize: true,
    validationSchema: categorySchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      try {
        mutate({ ...rest, ...(currentCategory && { currentSlug: currentCategory.slug }) });
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    Object.assign(file, { preview: URL.createObjectURL(file) });

    uploadMutate({
      file,
      config: {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentage = Math.floor((loaded * 100) / total);
          setstate((prev) => ({ ...prev, loading: percentage }));
        }
      }
    });
  };

  const handleTitleChange = (event) => {
    const title = event.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]+/g, '')
      .replace(/\s+/g, '-'); // convert to lowercase, remove special characters, and replace spaces with hyphens
    formik.setFieldValue('slug', slug); // set the value of slug in the formik state
    formik.handleChange(event); // handle the change in formik
  };
  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ md: 8, xs: 12 }}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Stack gap={1}>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <Typography variant="overline" color="text.primary" htmlFor="category-name" component={'label'}>
                        Category Name
                      </Typography>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rounded" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="category-name"
                        fullWidth
                        {...getFieldProps('name')}
                        onChange={handleTitleChange} // add onChange handler for title
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    )}
                  </Stack>
                  <Stack gap={1}>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={100} />
                    ) : (
                      <Typography variant="overline" color="text.primary" htmlFor="meta-title" component={'label'}>
                        Meta Title
                      </Typography>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rounded" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="meta-title"
                        fullWidth
                        {...getFieldProps('metaTitle')}
                        error={Boolean(touched.metaTitle && errors.metaTitle)}
                        helperText={touched.metaTitle && errors.metaTitle}
                      />
                    )}
                  </Stack>
                  <Stack gap={1}>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={70} />
                    ) : (
                      <Typography variant="overline" color="text.primary" htmlFor="slug" component={'label'}>
                        Slug
                      </Typography>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rounded" width="100%" height={56} />
                    ) : (
                      <TextField
                        fullWidth
                        id="slug"
                        {...getFieldProps('slug')}
                        error={Boolean(touched.slug && errors.slug)}
                        helperText={touched.slug && errors.slug}
                      />
                    )}
                  </Stack>
                  <Stack gap={1}>
                    {categoryLoading ? (
                      <Skeleton variant="text" width={100} />
                    ) : (
                      <Typography variant="overline" color="text.primary" htmlFor="description" component={'label'}>
                        Discription
                      </Typography>
                    )}
                    {categoryLoading ? (
                      <Skeleton variant="rounded" width="100%" height={240} />
                    ) : (
                      <TextField
                        fullWidth
                        id="description"
                        {...getFieldProps('description')}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description}
                        rows={9}
                        multiline
                      />
                    )}
                  </Stack>
                </Stack>
              </Card>
            </Grid>
            <Grid size={{ md: 4, xs: 12 }}>
              <div style={{ position: '-webkit-sticky', position: 'sticky', top: 0 }}>
                <Stack spacing={3}>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <Stack gap={1}>
                        {categoryLoading ? (
                          <Skeleton variant="text" width={150} />
                        ) : (
                          <Typography
                            variant="overline"
                            color="text.primary"
                            htmlFor="meta-description"
                            component={'label'}
                          >
                            Meta Description
                          </Typography>
                        )}
                        {categoryLoading ? (
                          <Skeleton variant="rounded" width="100%" height={240} />
                        ) : (
                          <TextField
                            id="meta-description"
                            fullWidth
                            {...getFieldProps('metaDescription')}
                            error={Boolean(touched.metaDescription && errors.metaDescription)}
                            helperText={touched.metaDescription && errors.metaDescription}
                            rows={9}
                            multiline
                          />
                        )}
                      </Stack>
                      <div>
                        <Stack gap={1}>
                          <Stack direction="row" justifyContent="space-between">
                            {categoryLoading ? (
                              <Skeleton variant="text" width={150} />
                            ) : (
                              <Typography variant="overline" color="text.primary" htmlFor="file" component={'label'}>
                                Image
                              </Typography>
                            )}
                            {categoryLoading ? (
                              <Skeleton variant="text" width={150} />
                            ) : (
                              <Typography variant="overline" component={'label'} htmlFor="brand-image">
                                <span>512 * 512</span>
                              </Typography>
                            )}
                          </Stack>
                          {categoryLoading ? (
                            <Skeleton variant="rounded" width="100%" height={225} />
                          ) : (
                            <UploadSingleFile
                              id="file"
                              file={values.cover}
                              onDrop={handleDrop}
                              error={Boolean(touched.cover && errors.cover)}
                              category
                              accept="image/*"
                              loading={state.loading}
                            />
                          )}
                        </Stack>
                        {touched.cover && errors.cover && (
                          <FormHelperText error sx={{ px: 2, mx: 0 }}>
                            {touched.cover && errors.cover}
                          </FormHelperText>
                        )}
                      </div>
                      <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                        <Stack gap={1}>
                          {categoryLoading ? (
                            <Skeleton variant="text" width={70} />
                          ) : (
                            <Typography variant="overline" color="text.primary" htmlFor="status" component={'label'}>
                              Status
                            </Typography>
                          )}
                          {categoryLoading ? (
                            <Skeleton variant="rounded" width="100%" height={56} />
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
                    </Stack>
                  </Card>
                  {categoryLoading ? (
                    <Skeleton variant="rounded" width="100%" height={56} />
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      loading={isLoading}
                      sx={{ ml: 'auto', mt: 3 }}
                    >
                      {currentCategory ? 'Update' : 'Create'}
                    </Button>
                  )}
                </Stack>
              </div>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
