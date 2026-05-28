'use client';
import React from 'react';
import { useRouter } from '@bprogress/next';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
// mui
import { Stack, TextField, Typography, Box, Button, InputAdornment, IconButton } from '@mui/material';

// api
import * as api from 'src/services';
// formik
import { useFormik, Form, FormikProvider } from 'formik';
// icons
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';
import { changePasswordSchema } from '@/validations';

export default function AccountChangePassword() {
  const pathname = usePathname();
  const [loading, setloading] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState(false);

  const { user } = useSelector(({ user }) => user);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: changePasswordSchema,
    onSubmit: async (values) => {
      setloading(true);
      const data = {
        password: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
        id: user._id
      };
      mutate(data);
    }
  });

  const { mutate } = useMutation({
    mutationFn: api.changePassword,
    onSuccess: () => {
      setloading(false);
      formik.resetForm();
      toast.success('Updated password');
    },
    onError: (err) => {
      setloading(false);
      toast.error(err?.response?.data?.message || 'Something went wrong!');
    }
  });

  React.useEffect(() => {
    if (!pathname.includes('admin') && user?.role.includes('admin')) {
      router.push('/admin/settings/change-password');
      toast("Admin can't access this page.", { duration: 6000 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { errors, touched, handleSubmit, getFieldProps } = formik;
  return (
    <Box>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="overline" color="text.primary" htmlFor="old-password" component={'label'}>
                Old Password
              </Typography>
              <TextField
                id="old-password"
                {...getFieldProps('oldPassword')}
                fullWidth
                autoComplete="on"
                type={oldPassword ? 'text' : 'password'}
                error={Boolean(touched.oldPassword && errors.oldPassword)}
                helperText={touched.oldPassword && errors.oldPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setOldPassword((prev) => !prev)}>
                        {oldPassword ? <MdOutlineVisibility size={24} /> : <MdOutlineVisibilityOff size={24} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="overline" color="text.primary" htmlFor="new-password" component={'label'}>
                New Password
              </Typography>
              <TextField
                id="new-password"
                {...getFieldProps('newPassword')}
                fullWidth
                autoComplete="on"
                type={newPassword ? 'text' : 'password'}
                error={Boolean(touched.newPassword && errors.newPassword)}
                helperText={(touched.newPassword && errors.newPassword) || 'Password must be minimum 6+'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setNewPassword((prev) => !prev)}>
                        {newPassword ? <MdOutlineVisibility size={24} /> : <MdOutlineVisibilityOff size={24} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography variant="overline" color="text.primary" htmlFor="confirm-new-password" component={'label'}>
                Confirm New Password
              </Typography>
              <TextField
                id="confirm-new-password"
                {...getFieldProps('confirmPassword')}
                fullWidth
                autoComplete="on"
                type={confirmPassword ? 'text' : 'password'}
                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setConfirmPassword((prev) => !prev)}>
                        {confirmPassword ? <MdOutlineVisibility size={24} /> : <MdOutlineVisibilityOff size={24} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Stack>
            <Button type="submit" variant="contained" size="large" loading={loading} fullWidth>
              Save Password
            </Button>
          </Stack>
        </Form>
      </FormikProvider>
    </Box>
  );
}
