import React from 'react';
import {
  Stack,
  TextField,
  Skeleton,
  Typography,
  FormHelperText,
  Tooltip,
  IconButton,
  Chip,
  Collapse
} from '@mui/material';

import { FaRegCircleQuestion } from 'react-icons/fa6';
import Autocomplete from '@mui/material/Autocomplete';
import TipTapEditor from '../../tip-tap-editor';
import UploadMultiFile from '@/components/upload/upload-multi-files';
import toast from 'react-hot-toast';
import * as api from 'src/services';
import { useMutation } from '@tanstack/react-query';
import { useUploadMultiFiles } from '@/hooks/use-upload-file';

export default function ProductInfo(props) {
  const { formik, handleTitleChange, isLoading } = props;
  const { values, errors, touched, getFieldProps, setFieldValue } = formik;
  const { mutateAsync: deleteMutate } = useMutation({
    mutationFn: api.singleDeleteFile,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete file.');
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

  const handleDrop = (acceptedFiles) => {
    if (!acceptedFiles?.length) return;

    // keep local previews if needed
    const blobs = acceptedFiles.map((file) => URL.createObjectURL(file));
    setFieldValue('blob', [...values.blob, ...blobs]);

    // trigger uploads
    uploadMutate({ files: acceptedFiles });
  };
  // handleAddVariants

  // handleRemoveAll
  const handleRemoveAll = () => {
    values.images.forEach((image) => {
      deleteMutate(image._id);
    });
    setFieldValue('images', []);
    setFieldValue('blob', []);
  };
  // handleRemove
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
    <Stack gap={2}>
      <Stack sx={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gridGap: 16 }}>
        <Stack gap={1}>
          <Typography variant="overline" component="label" htmlFor="product-name">
            {isLoading ? <Skeleton variant="text" width={140} /> : 'Product Name'}
          </Typography>

          {isLoading ? (
            <Skeleton variant="rounded" width="100%" height={56} />
          ) : (
            <TextField
              id="product-name"
              fullWidth
              {...getFieldProps('name')}
              onChange={handleTitleChange}
              error={Boolean(touched.name && errors.name)}
              helperText={touched.name && errors.name}
            />
          )}
        </Stack>

        <Stack gap={1}>
          <Typography variant="overline" component="label" htmlFor="slug">
            {isLoading ? <Skeleton variant="text" width={70} /> : 'Slug'}
          </Typography>

          {isLoading ? (
            <Skeleton variant="rounded" width="100%" height={56} />
          ) : (
            <TextField
              id="slug"
              fullWidth
              {...getFieldProps('slug')}
              error={Boolean(touched.slug && errors.slug)}
              helperText={touched.slug && errors.slug}
            />
          )}
        </Stack>

        <Stack gap={1}>
          <Typography variant="overline" component="label" htmlFor="meta-title">
            {isLoading ? <Skeleton variant="text" width={100} /> : 'Meta Title'}
          </Typography>

          {isLoading ? (
            <Skeleton variant="rounded" width="100%" height={56} />
          ) : (
            <TextField
              id="meta-title"
              fullWidth
              {...getFieldProps('metaTitle')}
              error={Boolean(touched.metaTitle && errors.metaTitle)}
              helperText={touched.metaTitle && errors.metaTitle}
            />
          )}
        </Stack>
      </Stack>

      <Stack sx={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gridGap: 16 }}>
        <Stack gap={1}>
          <Typography variant="overline" component="label" htmlFor="pincode">
            {isLoading ? <Skeleton variant="text" width={80} /> : 'Pincode'}
          </Typography>

          {isLoading ? (
            <Skeleton variant="rounded" width="100%" height={56} />
          ) : (
            <TextField
              id="pincode"
              fullWidth
              {...getFieldProps('pincode')}
              error={Boolean(touched.pincode && errors.pincode)}
              helperText={touched.pincode && errors.pincode}
              placeholder="Enter pincode"
            />
          )}
        </Stack>
      </Stack>

      <Stack sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gridGap: 16 }}>
        <Stack gap={2}>
          <Stack gap={1}>
            <Typography variant="overline" component="label" htmlFor="description">
              {isLoading ? <Skeleton variant="text" width={120} /> : 'Short Description (max 200 characters)'}
            </Typography>

            {isLoading ? (
              <Skeleton variant="rounded" width="100%" height={102} />
            ) : (
              <TextField
                id="description"
                fullWidth
                {...getFieldProps('description')}
                error={Boolean(touched.description && errors.description)}
                helperText={touched.description && errors.description}
                rows={3}
                multiline
              />
            )}
          </Stack>

          <Stack gap={1}>
            <Typography variant="overline" component="label" htmlFor="meta-description">
              {isLoading ? <Skeleton variant="text" width={140} /> : 'Meta Description (max 160 characters)'}
            </Typography>

            {isLoading ? (
              <Skeleton variant="rounded" width="100%" height={102} />
            ) : (
              <TextField
                id="meta-description"
                fullWidth
                {...getFieldProps('metaDescription')}
                error={Boolean(touched.metaDescription && errors.metaDescription)}
                helperText={touched.metaDescription && errors.metaDescription}
                rows={3}
                multiline
              />
            )}
          </Stack>

          <Stack gap={1}>
            <Stack direction="row" alignItems="center">
              <Typography variant="overline" component="label" htmlFor="tags">
                {isLoading ? <Skeleton variant="text" width={70} /> : 'Tags'}
              </Typography>
              {!isLoading && (
                <Tooltip title="Press enter to add tag" placement="top" arrow>
                  <IconButton sx={{ color: 'text.secondary', p: 0, px: 1 }} size="small">
                    <FaRegCircleQuestion />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
            {isLoading ? (
              <Skeleton variant="rounded" width="100%" height={56} />
            ) : (
              <Autocomplete
                id="tags"
                multiple
                freeSolo
                value={values.tags}
                onChange={(event, newValue) => setFieldValue('tags', newValue)}
                options={[]}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip size="small" {...getTagProps({ index })} key={option} label={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Boolean(touched.tags && errors.tags)}
                    helperText={touched.tags && errors.tags}
                  />
                )}
              />
            )}
          </Stack>
        </Stack>

        <Stack gap={1}>
          <Typography variant="overline" component="label" htmlFor="description">
            {isLoading ? <Skeleton variant="text" width={120} /> : 'Long Description (HTML Supported)'}
          </Typography>

          {isLoading ? (
            <Skeleton variant="rounded" width="100%" height={364} />
          ) : (
            <TipTapEditor onChange={(v) => setFieldValue('content', v)} value={values?.content} />
          )}
        </Stack>
      </Stack>

      <div>
        <Stack gap={1}>
          <Typography variant="overline" component={'label'} htmlFor="product-image">
            {isLoading ? (
              <Skeleton variant="text" width={240} />
            ) : (
              <>
                Product Images <span>Recommended Ratio: 1:1</span>
              </>
            )}
          </Typography>
          {isLoading ? (
            <Stack gap={3} alignItems="end">
              <Skeleton variant="rounded" width={'100%'} height={186} />
              <Skeleton variant="rounded" width={106} height={36} />
            </Stack>
          ) : (
            <UploadMultiFile
              id="product-image"
              showPreview
              maxSize={3145728}
              accept="image/*"
              files={values?.images}
              loading={uploadLoading}
              onDrop={handleDrop}
              onRemove={handleRemove}
              onRemoveAll={handleRemoveAll}
              blob={values.blob}
              error={Boolean(touched?.images && errors?.images)}
            />
          )}
        </Stack>
        {touched?.images && errors?.images && (
          <FormHelperText error sx={{ px: 2 }}>
            {errors.images}
          </FormHelperText>
        )}
      </div>

      <Collapse in={values.deliveryType === 'digital'}>
        <Stack gap={1}>
          {isLoading ? (
            <Skeleton variant="text" width={140} />
          ) : (
            <Typography variant="overline" component="label" htmlFor="demo-url">
              Demo URL
            </Typography>
          )}
          {isLoading ? (
            <Skeleton variant="rounded" width="100%" height={56} />
          ) : (
            <TextField
              id="demo-url"
              fullWidth
              {...getFieldProps('demo')}
              onChange={handleTitleChange}
              error={Boolean(touched.demo && errors.demo)}
              helperText={touched.demo && errors.demo}
            />
          )}
        </Stack>
      </Collapse>
    </Stack>
  );
}
