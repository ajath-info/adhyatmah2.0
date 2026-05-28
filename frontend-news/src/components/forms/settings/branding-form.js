'use client';
import { useState } from 'react';
// formik
import { useFormik, Form, FormikProvider } from 'formik';
// mui
import { Typography, Stack, TextField, Grid, Card, CardContent, Button, Skeleton, Box } from '@mui/material';
import UploadSingleFile from '@/components/upload/upload-single-file';
// api
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as api from 'src/services';
import { useUploadSingleFile } from '@/hooks/use-upload-file';
import { brandingSettingsSchema } from '@/validations';

const FONT_FAMILIES = [
  { label: 'Figtree', value: 'figtree' },
  { label: 'Montserrat', value: 'montserrat' },
  { label: 'Roboto', value: 'roboto' },
  { label: 'Open Sans', value: 'open-sans' }
];

export default function BrandingSettingsForm({ ...props }) {
  const { currentSetting, isloading } = props;
  const [loading, setloading] = useState(false);
  const [state, setstate] = useState({
    logoDarkLoading: false,
    logoLightLoading: false,
    faviconLoading: false,
    loading: false
  });

  const { mutate } = useMutation({
    mutationKey: ['create-general-setting'],
    mutationFn: api.updateBrandingSettingsByAdmin,
    onSuccess: async () => {
      setloading(false);
      toast.success('Theme Update successfully!');
    },
    onError: (err) => {
      setloading(false);
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  });

  const { mutateAsync: deleteMutate } = useMutation({
    mutationKey: ['delete-file'],
    mutationFn: api.singleDeleteFile,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Delete failed');
    }
  });

  const formik = useFormik({
    initialValues: {
      theme: {
        palette: {
          primary: currentSetting?.theme?.palette?.primary || '',
          secondary: currentSetting?.theme?.palette?.secondary || '',
          defaultDark: currentSetting?.theme?.palette?.defaultDark || '',
          defaultLight: currentSetting?.theme?.palette?.defaultLight || '',
          paperDark: currentSetting?.theme?.palette?.paperDark || '',
          paperLight: currentSetting?.theme?.palette?.paperLight || ''
        },
        themeName: 'default',
        fontFamily: currentSetting?.theme?.fontFamily || 'figtree'
      },
      contact: {
        address: currentSetting?.contact?.address || '',
        addressOnMap: currentSetting?.contact?.addressOnMap || '',
        lat: currentSetting?.contact?.lat || '',
        long: currentSetting?.contact?.long || '',
        email: currentSetting?.contact?.email || '',
        phone: currentSetting?.contact?.phone || '',
        whatsappNo: currentSetting?.contact?.whatsappNo || ''
      },
      fileLogoDark: currentSetting?.fileLogoDark || '',
      fileLogoLight: currentSetting?.fileLogoLight || '',
      fileFavico: currentSetting?.fileFavico || '',
      logoDark: currentSetting?.logoDark || null,
      logoLight: currentSetting?.logoLight || null,
      favicon: currentSetting?.favicon || null,
      socialLinks: {
        facebook: currentSetting?.socialLinks?.facebook || '',
        twitter: currentSetting?.socialLinks?.twitter || '',
        linkedin: currentSetting?.socialLinks?.linkedin || '',
        instagram: currentSetting?.socialLinks?.instagram || ''
      }
    },
    validationSchema: brandingSettingsSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setloading(true);
      mutate({ ...values, _id: currentSetting._id });
    }
  });

  const { errors, touched, values, handleSubmit, setFieldValue, getFieldProps } = formik;

  const { mutate: uploadMutate } = useUploadSingleFile(
    async (data, variables) => {
      const { field } = variables; // ✅ comes from mutate({..., field})

      // delete previous if exists

      const prevId = values[field]?._id;

      if (prevId) {
        await deleteMutate(prevId);
      }

      setFieldValue(field, { _id: data.public_id, url: data.secure_url });

      // ✅ functional update to avoid reset
      setstate((prev) => ({
        ...prev,
        [`${field}Loading`]: false
      }));
    },
    (error, variables) => {
      console.error(error);
      const { field } = variables;

      setstate((prev) => ({
        ...prev,
        [`${field}Loading`]: false
      }));
    }
  );
  const handleDrop = (acceptedFiles, field) => {
    const file = acceptedFiles[0];
    if (!file) return;

    uploadMutate({
      file,
      config: {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentage = Math.floor((loaded * 100) / total);

          // ✅ use functional update so we don’t reset state accidentally
          setstate((prev) => ({
            ...prev,
            [`${field}Loading`]: percentage
          }));
        }
      },
      field
    });
  };
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
                <Stack mb={2} gap={0.5}>
                  <Typography variant="h4">
                    {isloading ? <Skeleton variant="text" width={200} /> : 'Website Theme'}
                  </Typography>
                  <Typography variant="body1">
                    {isloading ? <Skeleton variant="text" width={180} /> : 'Select Color Theme'}
                  </Typography>
                </Stack>

                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="font-family" component="label">
                        {isloading ? <Skeleton variant="text" width={140} /> : 'Font Family'}
                      </Typography>

                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          select
                          fullWidth
                          id="font-family"
                          placeholder="Font Family"
                          {...getFieldProps('theme.fontFamily')}
                          SelectProps={{ native: true }}
                          error={Boolean(touched.theme?.fontFamily && errors.theme?.fontFamily)}
                          helperText={touched.theme?.fontFamily && errors.theme?.fontFamily}
                        >
                          {FONT_FAMILIES.map((font) => (
                            <option value={font.value} key={font.value}>
                              {font.label}
                            </option>
                          ))}
                        </TextField>
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" component="label" htmlFor="primary">
                        {isloading ? <Skeleton variant="text" width={140} /> : 'Primary Color'}
                      </Typography>

                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="primary"
                          fullWidth
                          type="color"
                          {...getFieldProps('theme.palette.primary')}
                          error={Boolean(touched.theme?.palette?.primary && errors.theme?.palette?.primary)}
                          helperText={touched.theme?.palette?.primary && errors.theme?.palette?.primary}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" component="label" htmlFor="secondary">
                        {isloading ? <Skeleton variant="text" width={140} /> : 'Secondary Color'}
                      </Typography>

                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="secondary"
                          fullWidth
                          type="color"
                          {...getFieldProps('theme.palette.secondary')}
                          error={Boolean(touched.theme?.palette?.secondary && errors.theme?.palette?.secondary)}
                          helperText={touched.theme?.palette?.secondary && errors.theme?.palette?.secondary}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" component="label" htmlFor="defaultDark">
                        {isloading ? <Skeleton variant="text" width={140} /> : 'Dark Background'}
                      </Typography>

                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="defaultDark"
                          fullWidth
                          type="color"
                          {...getFieldProps('theme.palette.defaultDark')}
                          error={Boolean(touched.theme?.palette?.defaultDark && errors.theme?.palette?.defaultDark)}
                          helperText={touched.theme?.palette?.defaultDark && errors.theme?.palette?.defaultDark}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" component="label" htmlFor="defaultLight">
                        {isloading ? <Skeleton variant="text" width={140} /> : 'Light Background'}
                      </Typography>

                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="defaultLight"
                          fullWidth
                          type="color"
                          {...getFieldProps('theme.palette.defaultLight')}
                          error={Boolean(touched.theme?.palette?.defaultLight && errors.theme?.palette?.defaultLight)}
                          helperText={touched.theme?.palette?.defaultLight && errors.theme?.palette?.defaultLight}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" component="label" htmlFor="paperDark">
                        {isloading ? <Skeleton variant="text" width={140} /> : 'Dark Paper'}
                      </Typography>

                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="paperDark"
                          fullWidth
                          type="color"
                          {...getFieldProps('theme.palette.paperDark')}
                          error={Boolean(touched.theme?.palette?.paperDark && errors.theme?.palette?.paperDark)}
                          helperText={touched.theme?.palette?.paperDark && errors.theme?.palette?.paperDark}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" component="label" htmlFor="paperLight">
                        {isloading ? <Skeleton variant="text" width={140} /> : 'Light Paper'}
                      </Typography>

                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="paperLight"
                          fullWidth
                          type="color"
                          {...getFieldProps('theme.palette.paperLight')}
                          error={Boolean(touched.theme?.palette?.paperLight && errors.theme?.palette?.paperLight)}
                          helperText={touched.theme?.palette?.paperLight && errors.theme?.palette?.paperLight}
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
                <Stack mb={2} gap={0.5}>
                  <Typography variant="h4">
                    {isloading ? <Skeleton variant="text" width={200} /> : 'Contact'}
                  </Typography>
                  <Typography variant="body1">
                    {isloading ? <Skeleton variant="text" width={130} /> : 'Contact Details'}
                  </Typography>
                </Stack>

                <Grid container spacing={2}>
                  <Grid size={{ md: 12, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="address" component="label">
                        {isloading ? <Skeleton variant="text" width={130} /> : 'Address'}
                      </Typography>

                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="address"
                          fullWidth
                          type="text"
                          {...getFieldProps('contact.address')}
                          error={Boolean(touched.contact?.address && errors.contact?.address)}
                          helperText={touched.contact?.address && errors.contact?.address}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="addressOnMap" component="label">
                        {isloading ? <Skeleton variant="text" width={110} /> : 'Address Map'}
                      </Typography>

                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="addressOnMap"
                          fullWidth
                          type="text"
                          {...getFieldProps('contact.addressOnMap')}
                          error={Boolean(touched.contact?.addressOnMap && errors.contact?.addressOnMap)}
                          helperText={touched.contact?.addressOnMap && errors.contact?.addressOnMap}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="lat" component="label">
                        {isloading ? <Skeleton variant="text" width={100} /> : 'Latitude'}
                      </Typography>

                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="lat"
                          fullWidth
                          type="text"
                          {...getFieldProps('contact.lat')}
                          error={Boolean(touched.contact?.lat && errors.contact?.lat)}
                          helperText={touched.contact?.lat && errors.contact?.lat}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="long" component="label">
                        {isloading ? <Skeleton variant="text" width={100} /> : 'Longitude'}
                      </Typography>

                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="long"
                          fullWidth
                          type="text"
                          {...getFieldProps('contact.long')}
                          error={Boolean(touched.contact?.long && errors.contact?.long)}
                          helperText={touched.contact?.long && errors.contact?.long}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="email" component="label">
                        {isloading ? <Skeleton variant="text" width={60} /> : 'Email'}
                      </Typography>

                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="email"
                          fullWidth
                          type="email"
                          {...getFieldProps('contact.email')}
                          error={Boolean(touched.contact?.email && errors.contact?.email)}
                          helperText={touched.contact?.email && errors.contact?.email}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="phone" component="label">
                        {isloading ? <Skeleton variant="text" width={60} /> : 'Phone'}
                      </Typography>

                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="phone"
                          fullWidth
                          type="phone"
                          {...getFieldProps('contact.phone')}
                          error={Boolean(touched.contact?.phone && errors.contact?.phone)}
                          helperText={touched.contact?.phone && errors.contact?.phone}
                        />
                      )}
                    </Stack>
                  </Grid>

                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="whatsappNo" component="label">
                        {isloading ? <Skeleton variant="text" width={120} /> : 'whatsapp No'}
                      </Typography>

                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="whatsappNo"
                          fullWidth
                          type="whatsappNo"
                          {...getFieldProps('contact.whatsappNo')}
                          error={Boolean(touched.contact?.whatsappNo && errors.contact?.whatsappNo)}
                          helperText={touched.contact?.whatsappNo && errors.contact?.whatsappNo}
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
              md: 12,
              xs: 12
            }}
          >
            <Card>
              <CardContent>
                <Stack mb={2} gap={0.5}>
                  <Typography variant="h4">
                    {isloading ? <Skeleton variant="text" width={120} /> : 'Branding'}
                  </Typography>
                  <Typography variant="overline">
                    {isloading ? <Skeleton variant="text" width={200} /> : 'Business logo and favicon.'}
                  </Typography>
                </Stack>
                <Grid container spacing={2}>
                  <Grid size={{ md: 4, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="fileLogoDark" component="label">
                        {isloading ? <Skeleton variant="text" width={160} /> : ' Business Logo Dark'}
                      </Typography>
                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={240} />
                      ) : (
                        <UploadSingleFile
                          id="fileLogoDark"
                          file={values.logoDark}
                          onDrop={(v) => handleDrop(v, 'logoDark')}
                          error={Boolean(touched.logoDark && errors.logoDark)}
                          category
                          accept="image/*"
                          loading={state.logoDarkLoading}
                        />
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 4, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="fileLogoLight" component="label">
                        {isloading ? <Skeleton variant="text" width={160} /> : ' Business Logo Light'}
                      </Typography>
                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={240} />
                      ) : (
                        <UploadSingleFile
                          id="fileLogoLight"
                          file={values.logoLight}
                          onDrop={(v) => handleDrop(v, 'logoLight')}
                          error={Boolean(touched.logoLight && errors.logoLight)}
                          category
                          accept="image/*"
                          loading={state.logoLightLoading}
                        />
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 4, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="fileFavico" component="label">
                        {isloading ? <Skeleton variant="text" width={110} /> : 'Favicon Logo'}
                      </Typography>
                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={240} />
                      ) : (
                        <UploadSingleFile
                          id="fileFavico"
                          file={values.favicon}
                          onDrop={(v) => handleDrop(v, 'favicon')}
                          error={Boolean(touched.favicon && errors.favicon)}
                          category
                          accept="image/*"
                          loading={state.faviconLoading}
                        />
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ md: 12, xs: 12 }}>
            <Card>
              <CardContent>
                <Stack mb={2} gap={0.5}>
                  <Typography variant="h4">
                    {isloading ? <Skeleton variant="text" width={140} /> : 'Social Links'}
                  </Typography>
                  <Typography variant="body1">
                    {isloading ? <Skeleton variant="text" width={200} /> : 'Social media pages links'}
                  </Typography>
                </Stack>
                <Grid container spacing={2}>
                  <Grid size={{ md: 3, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="facebook" component="label">
                        {isloading ? <Skeleton variant="text" width={80} /> : 'Facebook'}
                      </Typography>
                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="facebook"
                          fullWidth
                          type="text"
                          {...getFieldProps('socialLinks.facebook')}
                          error={Boolean(touched.socialLinks?.facebook && errors.socialLinks?.facebook)}
                          helperText={touched.socialLinks?.facebook && errors.socialLinks?.facebook}
                        />
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 3, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="twitter" component="label">
                        {isloading ? <Skeleton variant="text" width={70} /> : 'Twitter'}
                      </Typography>
                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="twitter"
                          fullWidth
                          type="text"
                          {...getFieldProps('socialLinks.twitter')}
                          error={Boolean(touched.socialLinks?.twitter && errors.socialLinks?.twitter)}
                          helperText={touched.socialLinks?.twitter && errors.socialLinks?.twitter}
                        />
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 3, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="linkedin" component="label">
                        {isloading ? <Skeleton variant="text" width={80} /> : 'Linkedin'}
                      </Typography>
                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="linkedin"
                          fullWidth
                          type="text"
                          {...getFieldProps('socialLinks.linkedin')}
                          error={Boolean(touched.socialLinks?.linkedin && errors.socialLinks?.linkedin)}
                          helperText={touched.socialLinks?.linkedin && errors.socialLinks?.linkedin}
                        />
                      )}
                    </Stack>
                  </Grid>
                  <Grid size={{ md: 3, xs: 12 }}>
                    <Stack gap={1} width={1}>
                      <Typography variant="overline" color="text.primary" htmlFor="instagram" component="label">
                        {isloading ? <Skeleton variant="text" width={100} /> : 'Instagram'}
                      </Typography>
                      {isloading ? (
                        <Skeleton variant="rounded" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="instagram"
                          fullWidth
                          type="text"
                          {...getFieldProps('socialLinks.instagram')}
                          error={Boolean(touched.socialLinks?.instagram && errors.socialLinks?.instagram)}
                          helperText={touched.socialLinks?.instagram && errors.socialLinks?.instagram}
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
            <Button fullWidth size="large" type="submit" variant="contained" loading={loading}>
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
