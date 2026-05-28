'use client';

import React from 'react';
import toast from 'react-hot-toast';

// material ui
import { Box, Stack, Grid, Button, TextField, Typography } from '@mui/material';
// formik
import { useFormik, Form, FormikProvider } from 'formik';
import { contactUsSchema } from '@/validations';
import PhoneInputField from '@/components/phone-input-field';
const ContactUs = () => {
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: { email: '', firstName: '', lastName: '', phone: '', message: '' },
    validationSchema: contactUsSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        setTimeout(() => {
          resetForm();
          setLoading(false);
          toast.success('Message sent!');
        }, 1000);
        // mutate({
        //   ...values
        // });
      } catch (error) {
        toast.error(error);
      }
    }
  });
  const { errors, touched, handleSubmit, getFieldProps, values, setFieldValue } = formik;
  // const { mutate } = useMutation(api.contactUs, {
  //   onSuccess: async () => {
  //     resetForm();
  //     setLoading(false);
  //     toast.success('Message sent!');
  //   },
  //   onError: (err) => {
  //     setLoading(false);
  //     toast.error(err.response.data.message);
  //   }
  // });

  return (
    <div>
      {/* from section  */}
      <Stack className="form-section">
        <Box className="form-feed">
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack direction={'column'} gap={3}>
                <Grid container spacing={3}>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                      label={'First Name'}
                      className="text-feed"
                      fullWidth
                      {...getFieldProps('firstName')}
                      error={Boolean(touched.firstName && errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                      label={'Last Name'}
                      className="text-feed"
                      fullWidth
                      {...getFieldProps('lastName')}
                      error={Boolean(touched.lastName && errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} mt={{ md: 0.1, xs: 0 }}>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                      label={'Your Email'}
                      className="text-feed"
                      fullWidth
                      {...getFieldProps('email')}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid size={{ md: 6, xs: 12 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="overline" color="text.primary" component="label">
                        Your Phone
                      </Typography>
                      <PhoneInputField
                        error={errors?.phone}
                        onChange={(val) => setFieldValue('phone', val)}
                        value={values.phone}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
              <Grid size={12} mt={3}>
                <TextField
                  label={'Your Message'}
                  className="text-feed"
                  multiline
                  rows={5}
                  fullWidth
                  {...getFieldProps('message')}
                  error={Boolean(touched?.message && errors?.message)}
                  helperText={touched?.message && errors?.message}
                />
              </Grid>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                className="send-btn"
                loading={loading}
                sx={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: '16px' }}
              >
                Send Message
              </Button>
            </Form>
          </FormikProvider>
        </Box>
      </Stack>
    </div>
  );
};

export default ContactUs;
