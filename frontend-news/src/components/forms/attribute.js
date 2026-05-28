'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
// mui

import {
  Stack,
  TextField,
  Typography,
  Box,
  Autocomplete,
  Chip,
  Grid,
  Button,
  Skeleton,
  IconButton,
  Tooltip
} from '@mui/material';
// api
import * as api from 'src/services';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import { attributeSchema } from '@/validations';

const commonAttributes = [
  'Color',
  'Size',
  'Material',
  'Brand',
  'Weight',
  'Length',
  'Width',
  'Height',
  'Capacity',
  'Flavor'
];
export default function AttributesForm({
  data: currentAttribute,
  isLoading: AttributeLoading,
  handleClose,
  handleCancel
}) {
  const mutationFn = currentAttribute ? api.updateAttributeByAdmin : api.addAttributeByAdmin;

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn,
    retry: false,
    onSuccess: (data) => {
      toast.success(data.message);
      handleClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  });

  const formik = useFormik({
    initialValues: { name: currentAttribute?.name || '', values: currentAttribute?.values || '' },
    enableReinitialize: true,
    validationSchema: attributeSchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      try {
        mutate({ ...rest, ...(currentAttribute && { currentId: currentAttribute._id }) });
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { errors, values, touched, handleSubmit, setFieldValue } = formik;
  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container justifyContent="center" spacing={2}>
            <Grid size={12}>
              <Stack spacing={3}>
                <Stack gap={1}>
                  <Typography variant="overline" color="text.primary" htmlFor="brand-name" component={'label'}>
                    {AttributeLoading ? <Skeleton variant="text" width={140} /> : 'Attribute Name'}
                  </Typography>

                  {AttributeLoading ? (
                    <Skeleton variant="rounded" width="100%" height={56} />
                  ) : (
                    <Autocomplete
                      id="attribute-name"
                      freeSolo
                      options={commonAttributes}
                      value={values.name}
                      onChange={(event, newValue) => {
                        setFieldValue('name', newValue || '');
                      }}
                      onInputChange={(event, newInputValue) => {
                        setFieldValue('name', newInputValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      )}
                    />
                  )}
                </Stack>
                <Stack gap={1}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Typography variant="overline" color="text.primary" htmlFor="brand-name" component={'label'}>
                      {AttributeLoading ? <Skeleton variant="text" width={70} /> : 'Values'}
                    </Typography>
                    {!AttributeLoading && (
                      <Tooltip title="Press enter to add tag" placement="top" arrow>
                        <IconButton sx={{ color: 'text.secondary' }} size="small">
                          <FaRegCircleQuestion />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>

                  {AttributeLoading ? (
                    <Skeleton variant="rounded" width="100%" height={56} />
                  ) : (
                    <Autocomplete
                      id="values"
                      multiple
                      freeSolo
                      value={values.values}
                      onChange={(event, newValue) => {
                        setFieldValue('values', newValue);
                      }}
                      options={[]}
                      renderTags={(values, getTagProps) =>
                        values.map((option, index) => (
                          <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          id=""
                          {...params}
                          error={Boolean(touched.values && errors.values)}
                          helperText={touched.values && errors.values}
                        />
                      )}
                    />
                  )}
                </Stack>
              </Stack>
            </Grid>
            <Box sx={{ ml: 'auto' }}>
              <Stack gap={1} direction={'row'}>
                {AttributeLoading ? (
                  <Skeleton variant="rounded" width="100%" height={56} />
                ) : (
                  <Button variant="outlined" size="large" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
                {AttributeLoading ? (
                  <Skeleton variant="rounded" width="100%" height={56} />
                ) : (
                  <Button type="submit" variant="contained" size="large" loading={isLoading}>
                    {currentAttribute ? 'Update Attribute' : 'Create Attribute'}
                  </Button>
                )}
              </Stack>
            </Box>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
AttributesForm.propTypes = { data: PropTypes.object, isLoading: PropTypes.bool };
