import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

// mui
import { styled } from '@mui/material/styles';
import { Button, TextField, Typography, FormHelperText, Stack, Rating } from '@mui/material';

// react
import { useMutation } from '@tanstack/react-query';
// api
import * as api from 'src/services';
// formik
import { useFormik, Form, FormikProvider } from 'formik';
import { useUploadMultiFiles } from '@/hooks/use-upload-file';
import { reviewSchema } from '@/validations';
// dynamic
const UploadMultiFile = dynamic(() => import('@/components/upload/upload-multi-files'));

const RootStyle = styled('div')(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  //   borderRadius: theme.shape.borderRadiusMd,
  borderRadius: '8px',
  backgroundColor: theme.palette.background.default
}));
export default function ProductDetailsReviewForm({ ...props }) {
  const { onClose, pid, onClickCancel, onAddingReview, ...other } = props;

  const { mutateAsync: deleteMutate } = useMutation({
    mutationFn: api.singleDeleteFile,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete file.');
    }
  });

  // Add review mutation
  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: api.addProductReview,
    onSuccess: ({ data, user }) => {
      onAddingReview({ ...data, user });
      toast.success('Added review');
      resetForm();
      onClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to add review.');
    }
  });

  const { mutate: uploadMutate, isPending: uploadLoading } = useUploadMultiFiles(
    (results) => {
      // results is an array of Cloudinary responses
      const newImages = results.map((data) => ({
        _id: data.public_id,
        url: data.secure_url
      }));

      setFieldValue('images', [...values.images, ...newImages]);
    },
    (error) => {
      console.error(error);
      toast.error(error.message);
    }
  );

  const formik = useFormik({
    initialValues: { rating: null, review: '', images: [], blob: [] },
    validationSchema: reviewSchema,
    onSubmit: async () => {
      mutate({ rating: values.rating, review: values.review, images: values.images.map((v) => v.url), pid: pid });
    }
  });

  const { values, errors, touched, resetForm, handleSubmit, setFieldValue, getFieldProps } = formik;

  const onCancel = () => {
    onClickCancel();
    resetForm();
  };

  const handleDrop = (acceptedFiles) => {
    if (!acceptedFiles?.length) return;

    // keep local previews if needed
    const blobs = acceptedFiles.map((file) => URL.createObjectURL(file));
    setFieldValue('blob', [...values.blob, ...blobs]);

    // trigger uploads
    uploadMutate({ files: acceptedFiles });
  };

  const handleRemoveAll = () => {
    values.images.forEach((image) => {
      deleteMutate(image._id);
    });
    setFieldValue('images', []);
    setFieldValue('blob', []);
  };
  const handleRemove = (file) => {
    const filtered = values.images.filter((_file) => {
      if (_file._id === file._id) {
        deleteMutate(file._id);
      }
      return _file !== file;
    });
    setFieldValue('images', filtered);
    setFieldValue('blob', [...filtered]);
  };
  return (
    <RootStyle {...other}>
      <Typography variant="subtitle1" gutterBottom>
        Add Review
      </Typography>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={1.5}>
              <Typography variant="body2">Your Review About</Typography>
              <Rating
                {...getFieldProps('rating')}
                onChange={(event) => setFieldValue('rating', Number(event.target.value))}
              />
            </Stack>
            {errors.rating && <FormHelperText error>{touched.rating && 'Rating Required'}</FormHelperText>}

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Review"
              type="text"
              {...getFieldProps('review')}
              error={Boolean(touched.review && errors.review)}
              helperText={touched.review && errors.review}
            />
            <UploadMultiFile
              showPreview
              maxSize={3145728}
              accept="image/*"
              files={values.images}
              loading={uploadLoading}
              onDrop={handleDrop}
              onRemove={handleRemove}
              onRemoveAll={handleRemoveAll}
              blob={values.blob}
              error={Boolean(touched.images && errors.images)}
            />
            {touched.images && errors.images && (
              <FormHelperText error sx={{ px: 2 }}>
                {touched.images && errors.images}
              </FormHelperText>
            )}
            <Stack direction="row" justifyContent="flex-end">
              <Button type="button" color="inherit" variant="outlined" onClick={onCancel} sx={{ mr: 1.5 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" loading={isLoading}>
                Post Review
              </Button>
            </Stack>
          </Stack>
        </Form>
      </FormikProvider>
    </RootStyle>
  );
}
ProductDetailsReviewForm.propTypes = {
  onClose: PropTypes.func,
  pid: PropTypes.string,
  onClickCancel: PropTypes.func,
  onAddingReview: PropTypes.func
};
