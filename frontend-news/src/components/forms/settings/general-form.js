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
  Button,
  Skeleton,
  MenuItem,
  Box
} from '@mui/material';
// api
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as api from 'src/services';
import { generalSettingsSchema } from '@/validations';

export default function MainSettingsForm({ ...props }) {
  const { currentSetting, isLoading } = props;
  const { mutate, isPending } = useMutation({
    mutationKey: ['update-general-setting'],
    mutationFn: api.updateGeneralSettingsByAdmin,
    onSuccess: async () => {
      toast.success('Settings Updated successfully!');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  });

  const formik = useFormik({
    initialValues: {
      paypal: {
        isActive: currentSetting?.paypal?.isActive || false,
        mode: currentSetting?.paypal?.mode || 'sandbox',
        clientId: currentSetting?.paypal?.clientId || ''
      },
      stripe: {
        isActive: currentSetting?.stripe?.isActive || false,
        mode: currentSetting?.stripe?.mode || 'sandbox',
        publishableKey: currentSetting?.stripe?.publishableKey || '',
        secretKey: currentSetting?.stripe?.secretKey || ''
      },
      razorpay: {
        isActive: currentSetting?.razorpay?.isActive || false,
        mode: currentSetting?.razorpay?.mode || 'sandbox',
        keyId: currentSetting?.razorpay?.keyId || '',
        keySecret: currentSetting?.razorpay?.keySecret || '',
        webhookSecret: currentSetting?.razorpay?.webhookSecret || ''
      },
      cloudinary: {
        cloudName: currentSetting?.cloudinary?.cloudName || '',
        apiKey: currentSetting?.cloudinary?.apiKey || '',
        apiSecret: currentSetting?.cloudinary?.apiSecret || '',
        preset: currentSetting?.cloudinary?.preset || ''
      },
      smtp: {
        isActive: currentSetting?.smtp?.isActive || false,
        host: currentSetting?.smtp?.host || '',
        port: currentSetting?.smtp?.port || 587,
        user: currentSetting?.smtp?.user || '',
        password: currentSetting?.smtp?.password || '',
        fromEmail: currentSetting?.smtp?.fromEmail || '',
        secure: currentSetting?.smtp?.secure || false
      }
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!currentSetting) return;
      mutate({ ...values, _id: currentSetting._id });
    }
  });

  const { errors, touched, values, handleSubmit, getFieldProps } = formik;
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid
            size={{
              md: 6,
              xs: 12
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  PayPal Settings
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Status'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField fullWidth select {...getFieldProps('paypal.isActive')}>
                          <MenuItem value={true}>Active</MenuItem>
                          <MenuItem value={false}>Inactive</MenuItem>
                        </TextField>
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Mode'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          fullWidth
                          select
                          {...getFieldProps('paypal.mode')}
                          disabled={!values.paypal.isActive}
                        >
                          <MenuItem value="sandbox">Sandbox</MenuItem>
                          <MenuItem value="live">Live</MenuItem>
                        </TextField>
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 12, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="client-id" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Client ID'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          disabled={!values.paypal.isActive}
                          id="client-id"
                          fullWidth
                          type="text"
                          {...getFieldProps('paypal.clientId')}
                          error={Boolean(touched?.paypal?.clientId && errors?.paypal?.clientId)}
                          helperText={touched?.paypal?.clientId && errors?.paypal?.clientId}
                        />
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            size={{
              md: 6,
              xs: 12
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Stripe Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Status'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField fullWidth select {...getFieldProps('stripe.isActive')}>
                          <MenuItem value={true}>Active</MenuItem>
                          <MenuItem value={false}>Inactive</MenuItem>
                        </TextField>
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <FormControl
                      fullWidth
                      sx={{ select: { textTransform: 'capitalize' } }}
                      disabled={!values.stripe.isActive}
                    >
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
                            {...getFieldProps('stripe.mode')}
                            error={Boolean(touched?.stripe?.mode && errors?.stripe?.mode)}
                          >
                            <option value="sandbox">Sandbox</option>
                            <option value="live">Live</option>
                          </Select>
                        )}
                      </Stack>
                      {touched?.stripe?.mode && errors?.stripe?.mode && (
                        <FormHelperText error sx={{ px: 2, mx: 0 }}>
                          {touched?.stripe?.mode && errors?.stripe?.mode}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="publishable-key" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={140} /> : 'Publishable Key'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          fullWidth
                          id="publishable-key"
                          {...getFieldProps('stripe.publishableKey')}
                          disabled={!values.stripe.isActive}
                        />
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="secret-key" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={140} /> : 'Secret Key'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          fullWidth
                          id="secret-key"
                          {...getFieldProps('stripe.secretKey')}
                          disabled={!values.stripe.isActive}
                        />
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            size={{
              md: 6,
              xs: 12
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Razorpay Settings
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Status'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField fullWidth select {...getFieldProps('razorpay.isActive')}>
                          <MenuItem value={true}>Active</MenuItem>
                          <MenuItem value={false}>Inactive</MenuItem>
                        </TextField>
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Mode'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          fullWidth
                          select
                          {...getFieldProps('razorpay.mode')}
                          disabled={!values.razorpay.isActive}
                        >
                          <MenuItem value="sandbox">Sandbox</MenuItem>
                          <MenuItem value="live">Live</MenuItem>
                        </TextField>
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 12, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="razorpay-key-id" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Key ID'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          disabled={!values.razorpay.isActive}
                          id="razorpay-key-id"
                          fullWidth
                          type="text"
                          {...getFieldProps('razorpay.keyId')}
                          error={Boolean(touched?.razorpay?.keyId && errors?.razorpay?.keyId)}
                          helperText={touched?.razorpay?.keyId && errors?.razorpay?.keyId}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 12, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography
                        variant="overline"
                        color="text.primary"
                        htmlFor="razorpay-key-secret"
                        component="label"
                      >
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Key Secret'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          disabled={!values.razorpay.isActive}
                          id="razorpay-key-secret"
                          fullWidth
                          type="password"
                          {...getFieldProps('razorpay.keySecret')}
                          error={Boolean(touched?.razorpay?.keySecret && errors?.razorpay?.keySecret)}
                          helperText={touched?.razorpay?.keySecret && errors?.razorpay?.keySecret}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 12, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography
                        variant="overline"
                        color="text.primary"
                        htmlFor="razorpay-webhook-secret"
                        component="label"
                      >
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Webhook Secret'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          disabled={!values.razorpay.isActive}
                          id="razorpay-webhook-secret"
                          fullWidth
                          type="password"
                          {...getFieldProps('razorpay.webhookSecret')}
                          error={Boolean(touched?.razorpay?.webhookSecret && errors?.razorpay?.webhookSecret)}
                          helperText={touched?.razorpay?.webhookSecret && errors?.razorpay?.webhookSecret}
                        />
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            size={{
              md: 6,
              xs: 12
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  Cloudinary Settings
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ md: 12, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="cloud-name" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={100} /> : 'Cloud Name'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField fullWidth id="cloud-name" {...getFieldProps('cloudinary.cloudName')} />
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 12, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="api-key" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={80} /> : 'API Key'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField fullWidth id="api-key" {...getFieldProps('cloudinary.apiKey')} />
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 12, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="api-secret" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={80} /> : 'API Secret'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField fullWidth id="api-secret" {...getFieldProps('cloudinary.apiSecret')} />
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 12, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="upload-preset" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={80} /> : 'Upload Preset'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField fullWidth id="upload-preset" {...getFieldProps('cloudinary.preset')} />
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            size={{
              md: 6,
              xs: 12
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  SMTP Settings
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Status'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField fullWidth select {...getFieldProps('smtp.isActive')}>
                          <MenuItem value={true}>Active</MenuItem>
                          <MenuItem value={false}>Inactive</MenuItem>
                        </TextField>
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="host" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Host'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          fullWidth
                          id="host"
                          {...getFieldProps('smtp.host')}
                          disabled={!values.smtp.isActive}
                        />
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="port" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Port'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          fullWidth
                          id="port"
                          type="number"
                          {...getFieldProps('smtp.port')}
                          disabled={!values.smtp.isActive}
                        />
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="user" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'user'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          fullWidth
                          id="user"
                          {...getFieldProps('smtp.user')}
                          disabled={!values.smtp.isActive}
                        />
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="password" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'password'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          fullWidth
                          id="password"
                          {...getFieldProps('smtp.password')}
                          disabled={!values.smtp.isActive}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'Secure'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField fullWidth select {...getFieldProps('smtp.secure')} disabled={!values.smtp.isActive}>
                          <MenuItem value={true}>Yes</MenuItem>
                          <MenuItem value={false}>No</MenuItem>
                        </TextField>
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 12, xs: 12 }}>
                    <Stack gap={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="fromEmail" component="label">
                        {isLoading ? <Skeleton animation="wave" variant="text" width={120} /> : 'from Email'}
                      </Typography>
                      {isLoading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          fullWidth
                          id="fromEmail"
                          {...getFieldProps('smtp.fromEmail')}
                          disabled={!values.smtp.isActive}
                        />
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* Button */}
          <Box sx={{ ml: 'auto' }}>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isPending || isLoading}
              disabled={!currentSetting}
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
