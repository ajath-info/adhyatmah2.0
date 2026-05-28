'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useSearchParams } from 'next/navigation';
import { useRouter } from '@bprogress/next';
import toast from 'react-hot-toast';

// formik
import { useFormik, Form, FormikProvider } from 'formik';
// cookies
import { setCookie } from '@/hooks/use-cookies';
// redux
import { useDispatch } from 'react-redux';
import { setWishlist } from 'src/redux/slices/wishlist';
import { signIn } from 'src/redux/slices/user';
// api
import * as api from 'src/services';
// mui
import {
  Typography,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Button,
  Alert,
  AlertTitle
} from '@mui/material';
// icons
import { MdOutlineVisibility, MdLock, MdOutlineVisibilityOff } from 'react-icons/md';
import { IoMdMail } from 'react-icons/io';
import Link from '@/utils/link';
import { signInSchema } from '@/validations';

export default function SignInForm() {
  const { push } = useRouter();
  const dispatch = useDispatch();

  const searchParam = useSearchParams();
  const redirect = searchParam.get('redirect');
  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { mutate } = useMutation({
    mutationFn: api.signIn,
    onSuccess: async (data) => {
      dispatch(signIn(data.user));
      dispatch(setWishlist(data.user.wishlist));
      await setCookie('token', data.token);
      toast.success('Logged in successfully!');

      const isAdmin = data.user?.role?.includes('admin');
      const isVendor = data.user?.role?.includes('vendor');

      push(redirect ? redirect : isAdmin ? '/admin/dashboard' : isVendor ? '/vendor/dashboard' : '/');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Sign in failed, please try again.');
    },
    onSettled: () => {
      setloading(false);
    }
  });

  const formik = useFormik({
    initialValues: { email: '', password: '', remember: true },
    validationSchema: signInSchema,

    onSubmit: async (values) => {
      const { email, password } = values;
      setloading(true);
      mutate({ email, password });
    }
  });
  const { errors, touched, setFieldValue, values, handleSubmit, getFieldProps } = formik;
  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack gap={0.5} width={1}>
              <Typography variant="overline" color="text.primary" htmlFor="email" component={'label'}>
                Email
              </Typography>
              <TextField
                id="email"
                fullWidth
                autoComplete="username"
                type="email"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoMdMail size={24} />
                    </InputAdornment>
                  )
                }}
              />
            </Stack>

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
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <FormControlLabel
              control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
              label="Remember me"
            />
            <Link variant="subtitle2" href="/auth/forget-password">
              Forgot password
            </Link>
          </Stack>
          <Button fullWidth size="large" type="submit" variant="contained" loading={loading}>
            Sign in
          </Button>
          <Typography variant="subtitle2" mt={3} textAlign="center">
            Don{`'`}t you have an account? &nbsp;
            <Link href={`/auth/sign-up${redirect ? '?redirect=' + redirect : ''}`}>Sign up</Link>
          </Typography>
        </Form>
      </FormikProvider>
    </>
  );
}
