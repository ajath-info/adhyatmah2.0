'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@bprogress/next';
import Link from '@/utils/link';
import { toast } from 'react-hot-toast';
// formik
import { useFormik, Form, FormikProvider } from 'formik';
// redux
import { useDispatch } from 'react-redux';
import { signIn } from 'src/redux/slices/user';
// api
import { useMutation } from '@tanstack/react-query';
import * as api from 'src/services';
// mui
import { Stack, TextField, Button, IconButton, InputAdornment, MenuItem, Typography } from '@mui/material';

// icons
import { MdOutlineVisibility } from 'react-icons/md';
import { MdOutlineVisibilityOff } from 'react-icons/md';
import { IoMdMale } from 'react-icons/io';
import { IoMdMail } from 'react-icons/io';
import { MdLock } from 'react-icons/md';
import { IoMdFemale } from 'react-icons/io';
import { IoPerson } from 'react-icons/io5';

import { FaTransgender } from 'react-icons/fa6';
// hooks
import { setCookie } from '@/hooks/use-cookies';
import PhoneInputField from '../phone-input-field';
import { signUpSchema } from '@/validations';
export default function SignUpForm() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const redirect = searchParam.get('redirect');
  const dispatch = useDispatch();

  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { firstName: '', lastName: '', phone: '', gender: 'male', email: '', password: '' },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      setloading(true);
      await mutate({ ...values });
    }
  });

  const { mutate } = useMutation({
    mutationFn: api.signUp,
    onSuccess: async (data) => {
      dispatch(signIn(data.user));
      await setCookie('token', data.token);
      toast.success(`OTP sent to your email ${data.user.firstName}`);
      router.push(redirect ? `/auth/verify-otp?redirect=${redirect}` : `/auth/verify-otp`);
    },
    onError: (err) => {
      const message = err?.response?.data?.message;
      toast.error(message || 'Something went wrong!');
    },
    onSettled: () => {
      setloading(false);
    }
  });
  const { errors, touched, handleSubmit, values, getFieldProps, setFieldValue } = formik;
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Stack gap={0.5} width={1}>
              <Typography variant="overline" color="text.primary" htmlFor="firstName" component={'label'}>
                First Name
              </Typography>
              <TextField
                id="firstName"
                fullWidth
                type="text"
                {...getFieldProps('firstName')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoPerson size={24} />
                    </InputAdornment>
                  )
                }}
              />
            </Stack>
            <Stack gap={0.5} width={1}>
              <Typography variant="overline" color="text.primary" htmlFor="lastName" component={'label'}>
                Last Name
              </Typography>
              <TextField
                fullWidth
                id="lastName"
                type="text"
                {...getFieldProps('lastName')}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoPerson size={24} />
                    </InputAdornment>
                  )
                }}
              />
            </Stack>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Stack gap={0.5} width={1}>
              <Typography variant="overline" color="text.primary" htmlFor="gender" component={'label'}>
                Gender
              </Typography>
              <TextField
                id="gender"
                select
                fullWidth
                {...getFieldProps('gender')}
                error={Boolean(touched.gender && errors.gender)}
                helperText={touched.gender && errors.gender}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {values.gender === 'male' ? (
                        <IoMdMale size={24} />
                      ) : values.gender === 'female' ? (
                        <IoMdFemale size={24} />
                      ) : (
                        <FaTransgender />
                      )}
                    </InputAdornment>
                  )
                }}
              >
                {['Male', 'Female', 'Other'].map((option) => (
                  <MenuItem key={option} value={option.toLowerCase()}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack gap={0.5} width={1}>
              <Typography variant="overline" color="text.primary" htmlFor="phone" component={'label'}>
                Phone
              </Typography>
              <PhoneInputField
                error={errors?.phone}
                onChange={(val) => setFieldValue('phone', val)}
                value={values.phone}
              />
            </Stack>
          </Stack>
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

          <Button fullWidth size="large" type="submit" variant="contained" loading={loading}>
            Sign up
          </Button>

          <Typography variant="subtitle2" mt={3} textAlign="center">
            Already have an account? &nbsp;
            <Link href={`/auth/sign-in${router.query?.redirect ? '?redirect=' + router.query?.redirect : ''}`}>
              Sign in
            </Link>
          </Typography>
        </Stack>
        <Typography variant="body2" align="center" color="text.secondary" mt={2}>
          By registering, I agree to adhyatmah&nbsp;
          <Link underline="always" color="text.primary" href="/terms-and-conditions" variant="body2">
            Terms
          </Link>
          &nbsp;and&nbsp;
          <Link variant="body2" underline="always" color="text.primary" href="/privacy-policy">
            Privacy policy
          </Link>
          .
        </Typography>
      </Form>
    </FormikProvider>
  );
}
