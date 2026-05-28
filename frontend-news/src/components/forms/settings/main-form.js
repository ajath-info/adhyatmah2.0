'use client';

// formik
import { useFormik, Form, FormikProvider } from 'formik';
// mui
import {
  Typography,
  Stack,
  TextField,
  Grid,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Select,
  Chip,
  Autocomplete,
  Button,
  Skeleton,
  Box
} from '@mui/material';
// api
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as api from 'src/services';
import { mainSettingsSchema } from '@/validations';

const WEBSITE_OPTIONS = [
  { label: 'no', value: false },
  { label: 'yes', value: true }
];

export default function MainSettingsForm({ ...props }) {
  const { currentSetting, isLoading } = props;
  const { mutate, isPending } = useMutation({
    mutationKey: ['create-general-setting'],
    mutationFn: api.updateMainSettingsByAdmin,
    onSuccess: async () => {
      toast.success('Settings Updated successfully!');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  });

  const formik = useFormik({
    initialValues: {
      businessName: currentSetting?.businessName || '',
      domainName: currentSetting?.domainName || '',

      websiteStatus: currentSetting?.websiteStatus || false,
      offlineMessage: currentSetting?.offlineMessage || '',

      seo: {
        metaTitle: currentSetting?.seo?.metaTitle || '',
        description: currentSetting?.seo?.description || '',
        metaDescription: currentSetting?.seo?.metaDescription || '',
        tags: currentSetting?.seo?.tags || []
      },
      gaId: currentSetting?.gaId || '',
      gtmId: currentSetting?.gtmId || '',
      shippingFee: currentSetting?.shippingFee || 0,
      commission: currentSetting?.commission || 0
    },
    validationSchema: mainSettingsSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      mutate({ ...values, _id: currentSetting._id });
    }
  });

  const { errors, touched, values, handleSubmit, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid
            size={{
              md: 12,
              xs: 12
            }}
          >
            <Card>
              <CardContent>
                <Stack mb={2}>
                  <Typography variant="h4">
                    {isLoading ? <Skeleton animation="wave" variant="text" width={170} /> : 'Main Setting'}
                  </Typography>
                </Stack>

                <Grid container spacing={2}>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="businessName" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Business Name'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="businessName"
                          fullWidth
                          type="text"
                          {...getFieldProps('businessName')}
                          error={Boolean(touched.businessName && errors.businessName)}
                          helperText={touched.businessName && errors.businessName}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="domainName" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Domain Name'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="domainName"
                          fullWidth
                          type="text"
                          {...getFieldProps('domainName')}
                          error={Boolean(touched.domainName && errors.domainName)}
                          helperText={touched.domainName && errors.domainName}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="title" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : 'Meta Title'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="title"
                          fullWidth
                          autoComplete="username"
                          type="text"
                          {...formik.getFieldProps('seo.metaTitle')}
                          error={Boolean(formik.touched.seo?.metaTitle && formik.errors.seo?.metaTitle)}
                          helperText={formik.touched.seo?.metaTitle && formik.errors.seo?.metaTitle}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="tags" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : 'Meta Tags'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <Autocomplete
                          id="tags"
                          multiple
                          freeSolo
                          value={values.seo?.tags}
                          onChange={(event, newValue) => {
                            setFieldValue('seo.tags', newValue);
                          }}
                          options={[]}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip {...getTagProps({ index })} key={index} size="small" label={option} />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(touched.seo?.tags && errors.seo?.tags)}
                              helperText={touched.seo?.tags && errors.seo?.tags}
                            />
                          )}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                      <Stack gap={1} width={1}>
                        <Typography variant="overline" color="text.primary" htmlFor="websiteStatus" component="label">
                          {isLoading ? <Skeleton animation="wave" variant="text" width={140} /> : 'Website Offline'}
                        </Typography>
                        {isLoading ? (
                          <Skeleton variant="rounded" width="100%" height={56} />
                        ) : (
                          <Select
                            id="websiteStatus"
                            native
                            {...getFieldProps('websiteStatus')}
                            error={Boolean(touched.websiteStatus && errors.websiteStatus)}
                          >
                            <option value="" style={{ display: 'none' }} />
                            {WEBSITE_OPTIONS.map((websiteStatus) => (
                              <option key={websiteStatus.value} value={websiteStatus.value}>
                                {websiteStatus.label}
                              </option>
                            ))}
                          </Select>
                        )}
                      </Stack>
                      {touched.websiteStatus && errors.websiteStatus && (
                        <FormHelperText error sx={{ px: 2, mx: 0 }}>
                          {touched.websiteStatus && errors.websiteStatus}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="offlineMessage" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={140} /> : 'Offline Message'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="offlineMessage"
                          fullWidth
                          {...getFieldProps('offlineMessage')}
                          error={Boolean(touched.offlineMessage && errors.offlineMessage)}
                          helperText={touched.offlineMessage && errors.offlineMessage}
                          rows={1}
                          multiline
                        />
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="meta-description" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={140} /> : 'Meta Description'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={194} />
                      ) : (
                        <TextField
                          id="meta-description"
                          fullWidth
                          {...getFieldProps('seo.metaDescription')}
                          error={Boolean(touched.seo?.metaDescription && errors.seo?.metaDescription)}
                          helperText={touched.seo?.metaDescription && errors.seo?.metaDescription}
                          rows={7}
                          multiline
                        />
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="description" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Description'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={194} />
                      ) : (
                        <TextField
                          id="description"
                          fullWidth
                          {...getFieldProps('seo.description')}
                          error={Boolean(touched.seo?.description && errors.seo?.description)}
                          helperText={touched.seo?.description && errors.seo?.description}
                          rows={7}
                          multiline
                        />
                      )}
                    </Stack>
                  </Grid>
                  <Grid container spacing={2} width={'100%'}>
                    <Grid
                      size={{
                        md: 3,
                        xs: 12
                      }}
                    >
                      <Stack gap={1} width={1}>
                        <Typography variant="overline" color="text.primary" htmlFor="commission" component="label">
                          {isLoading ? <Skeleton variant="text" width={140} /> : 'Vendor Commission in percent'}
                        </Typography>
                        {isLoading ? (
                          <Skeleton variant="rounded" width="100%" height={56} />
                        ) : (
                          <TextField
                            id="commission"
                            type="number"
                            fullWidth
                            {...getFieldProps('commission')}
                            error={Boolean(touched.commission && errors.commission)}
                            helperText={touched.commission && errors.commission}
                          />
                        )}
                      </Stack>
                    </Grid>
                    <Grid
                      size={{
                        md: 3,
                        xs: 12
                      }}
                    >
                      <Stack gap={1} width={1}>
                        <Typography variant="overline" color="text.primary" htmlFor="shippingFee" component="label">
                          {isLoading ? <Skeleton variant="text" width={140} /> : 'Shipping fee'}
                        </Typography>
                        {isLoading ? (
                          <Skeleton variant="rounded" width="100%" height={56} />
                        ) : (
                          <TextField
                            id="shippingFee"
                            fullWidth
                            type="number"
                            {...getFieldProps('shippingFee')}
                            error={Boolean(touched.shippingFee && errors.shippingFee)}
                            helperText={touched.shippingFee && errors.shippingFee}
                          />
                        )}
                      </Stack>
                    </Grid>
                    <Grid
                      size={{
                        md: 3,
                        xs: 12
                      }}
                    >
                      <Stack gap={1} width={1}>
                        <Typography variant="overline" color="text.primary" htmlFor="gaId" component="label">
                          {isLoading ? <Skeleton variant="text" width={140} /> : 'Google Analysis ID'}
                        </Typography>
                        {isLoading ? (
                          <Skeleton variant="rounded" width="100%" height={56} />
                        ) : (
                          <TextField
                            id="gaId"
                            fullWidth
                            {...getFieldProps('gaId')}
                            error={Boolean(touched.gaId && errors.gaId)}
                            helperText={touched.gaId && errors.gaId}
                          />
                        )}
                      </Stack>
                    </Grid>
                    <Grid
                      size={{
                        md: 3,
                        xs: 12
                      }}
                    >
                      <Stack gap={1} width={1}>
                        <Typography variant="overline" color="text.primary" htmlFor="gtmId" component="label">
                          {isLoading ? <Skeleton variant="text" width={140} /> : 'Google Tag Manager  ID'}
                        </Typography>
                        {isLoading ? (
                          <Skeleton variant="rounded" width="100%" height={56} />
                        ) : (
                          <TextField
                            id="gtmId"
                            fullWidth
                            {...getFieldProps('gtmId')}
                            error={Boolean(touched.gtmId && errors.gtmId)}
                            helperText={touched.gtmId && errors.gtmId}
                          />
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Box sx={{ ml: 'auto' }}>
            <Button fullWidth size="large" type="submit" variant="contained" loading={isPending || isLoading}>
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
