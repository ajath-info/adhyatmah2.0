'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from '@bprogress/next';
import { toast } from 'react-hot-toast';

// formik
import { Form, FormikProvider, useFormik } from 'formik';
// mui
import { TextField, Stack, InputAdornment, Button, IconButton, Typography } from '@mui/material';

// icons
import { MdOutlineVisibility } from 'react-icons/md';
import { MdOutlineVisibilityOff } from 'react-icons/md';
import { MdLock } from 'react-icons/md';
// api
import * as api from 'src/services';
import { useMutation } from '@tanstack/react-query';
import { resetPasswordSchema } from '@/validations';

// ----------------------------------------------------------------------

export default function ResetPasswordForm({ ...props }) {
  const { token } = props;
  const { push } = useRouter();
  const [loading, setloading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const { mutate } = useMutation({
    mutationFn: api.resetPassword,
    onSuccess: () => {
      push('/auth/sign-in');
      toast.success('Password successfully updated.');
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      toast.error(message || 'Reset failed. Try again.');
    },
    onSettled: () => {
      setloading(false);
    }
  });

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      setloading(true);
      await mutate({ newPassword: values.password, token });
    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack gap={0.5} width={1}>
            <Typography variant="overline" color="text.primary" htmlFor="password" component={'label'}>
              Password
            </Typography>
            <TextField
              id="password"
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              {...getFieldProps('password')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdLock size={24} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <MdOutlineVisibility size={24} /> : <MdOutlineVisibilityOff size={24} />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
          </Stack>
          <Stack gap={0.5} width={1}>
            <Typography variant="overline" color="text.primary" htmlFor="confirmPassword" component={'label'}>
              Confirm Password
            </Typography>
            <TextField
              id="confirmPassword"
              fullWidth
              autoComplete="current-password"
              type={showConfirmPassword ? 'text' : 'password'}
              {...getFieldProps('confirmPassword')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdLock size={24} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                      {showConfirmPassword ? <MdOutlineVisibility size={24} /> : <MdOutlineVisibilityOff size={24} />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />
          </Stack>

          <Button fullWidth size="large" type="submit" variant="contained" loading={loading}>
            Save
          </Button>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
ResetPasswordForm.propTypes = { token: PropTypes.string.isRequired };
