'use client';

import React from 'react';
import toast from 'react-hot-toast';

// material ui
import { Box, Stack, Button, TextField, Typography, Alert } from '@mui/material';
// formik
import { useFormik, Form, FormikProvider } from 'formik';
import { accountDeletionSchema } from '@/validations';
import http from '@/services/http';

const AccountDeletion = () => {
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: accountDeletionSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        
        const response = await http.post('/requestAccountDeletion', values);
        
        if (response.data.error === false) {
          toast.success(response.data.message);
          resetForm();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <div>
      <Stack className="form-section">
        <Box className="form-feed">
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack direction={'column'} gap={3}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Warning:</strong> This action will permanently delete your account and all associated data. 
                    This action cannot be undone. If you simply want to check the data we have stored, you can log in to the website.
                  </Typography>
                </Alert>

                <Typography variant="h6" gutterBottom>
                  Request Account Delete
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Send a request to delete your account stored in our system. You will receive a confirmation message once your request is accepted. 
                  After verification, we will proceed with deleting your account.
                </Typography>

                <Typography variant="body2" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Note: Your request for account deletion will be fulfilled within 24 hours.
                </Typography>

                <TextField
                  label={'Email Address'}
                  className="text-feed"
                  fullWidth
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  placeholder="Enter your registered email address"
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  className="send-btn"
                  disabled={loading}
                  sx={{ 
                    textTransform: 'capitalize', 
                    fontWeight: 'bold', 
                    fontSize: '16px',
                    backgroundColor: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    }
                  }}
                >
                  {loading ? 'Submitting Request...' : 'Submit Deletion Request'}
                </Button>
              </Stack>
            </Form>
          </FormikProvider>
        </Box>
      </Stack>
    </div>
  );
};

export default AccountDeletion;
