import React from 'react';
import {
  Stack,
  Typography,
  Select,
  MenuItem,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
  Checkbox,
  ListItemText,
  OutlinedInput,
  IconButton,
  TextField,
  FormHelperText,
  Divider
} from '@mui/material';
import { MdDelete } from 'react-icons/md';

import toast from 'react-hot-toast';
import * as api from 'src/services';
import { useMutation } from '@tanstack/react-query';
import { fCurrency } from '@/utils/format-number';
import UploadMultiFile from '@/components/upload/upload-multi-files';
import { useUploadMultiFiles } from '@/hooks/use-upload-file';

function generateCombinations(data, index = 0, current = [], result = []) {
  if (index === data.length) {
    result.push({ name: current.join('/') });
    return null;
  }

  for (const value of data[index].value) {
    generateCombinations(data, index + 1, [...current, value], result);
  }

  return result;
}

export default function VariableProduct({
  formik,
  variants,
  setCount,
  count,
  isInitialized,
  setInitialized,
  isLoading
}) {
  const { setFieldValue, values, getFieldProps, touched, errors } = formik;
  const [availableVariants, setAvailableVariants] = React.useState(variants);

  const handleAddVariant = () => {
    setFieldValue('selectedVariants', [...values.selectedVariants, { name: '', value: [] }]);
  };

  const handleVariantChange = (index, event) => {
    setCount((prev) => prev + 1);
    const newSelectedVariantName = event.target.value;
    const oldSelectedVariantName = values.selectedVariants[index].name;

    const newSelectedVariants = [...values.selectedVariants];
    newSelectedVariants[index] = { name: newSelectedVariantName, value: [] };
    setFieldValue('selectedVariants', newSelectedVariants);

    setAvailableVariants((prev) => {
      const newAvailableVariants = [...prev];
      if (oldSelectedVariantName) {
        const oldVariant = variants.find((v) => v.name === oldSelectedVariantName);
        if (oldVariant) newAvailableVariants.push(oldVariant);
      }
      return newAvailableVariants.filter((v) => v.name !== newSelectedVariantName);
    });
  };

  const handleVariantValueChange = (index, event) => {
    setCount((prev) => prev + 1);
    const newSelectedVariants = [...values.selectedVariants];

    // Ensure value is treated as an array
    const selectedValues = Array.isArray(event.target.value) ? event.target.value : [event.target.value];

    newSelectedVariants[index].value = selectedValues;
    setFieldValue('selectedVariants', newSelectedVariants);
  };

  const handleRemoveVariant = (index) => {
    const removedVariant = values.selectedVariants[index].name;
    const newSelectedVariants = values.selectedVariants.filter((_, i) => i !== index);
    setFieldValue('selectedVariants', newSelectedVariants);

    if (removedVariant) {
      const removedVariantObject = variants.find((v) => v.name === removedVariant);
      if (removedVariantObject) {
        setAvailableVariants([...availableVariants, removedVariantObject]);
      }
    }
  };
  const { mutateAsync: deleteMutate } = useMutation({
    mutationFn: api.singleDeleteFile,
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete file.');
    }
  });
  const [loading, setloading] = React.useState(false);
  // handle drop
  const { mutate: uploadMutate } = useUploadMultiFiles(
    (results, { index }) => {
      const newImages = results.map((data) => ({
        _id: data.public_id,
        url: data.secure_url
      }));

      setFieldValue(`variants[${index}].images`, values.variants[index].images.concat(newImages));
      setloading(null);
    },
    (error) => {
      console.error(error);
      setloading(null);
      toast.error(error.message);
    }
  );

  const handleDrop = (acceptedFiles, index) => {
    if (!acceptedFiles?.length) return;
    setloading(index);

    const blobs = acceptedFiles.map((file) => URL.createObjectURL(file));
    setFieldValue(`variants[${index}].blob`, values.variants[index].blob.concat(blobs));

    // ✅ pass index to mutate
    uploadMutate({ files: acceptedFiles, index });
  };
  // handleAddVariants

  // handleRemoveAll
  const handleRemoveAll = (index) => {
    values.variants[index].images.forEach((image) => {
      deleteMutate(image._id);
    });
    setFieldValue(`variants[${index}].images`, []);
    setFieldValue(`variants[${index}].blob`, []);
  };
  // handleRemove
  const handleRemove = (file, index) => {
    const filtered = values.variants[index].images.filter((_file) => {
      if (_file._id === file._id) {
        deleteMutate(file._id);
      }
      return _file !== file;
    });
    setFieldValue(`variants[${index}].images`, filtered);
    setFieldValue(`variants[${index}].blob`, filtered);
  };

  React.useEffect(() => {
    if (!isLoading) {
      const result = {
        names: values.selectedVariants.map((item) => item.name),
        data: generateCombinations(values.selectedVariants) || []
      };

      if (isInitialized) {
        setFieldValue(
          'variants',
          result.data.map((v) => ({
            ...v,
            variant: result.names.join('/'),
            stockQuantity: '',
            sku: '',
            images: [],
            blob: []
          }))
        );
      } else {
        setFieldValue(
          'variants',
          result.data.map((v, i) => ({
            ...v,
            variant: values.variants[i].variant,
            stockQuantity: values.variants[i].stockQuantity,
            sku: values.variants[i].sku,
            images: values.variants[i].images,
            blob: []
          }))
        );
        setInitialized(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const isDigital = values.deliveryType === 'digital';
  return (
    <CardContent>
      <Stack gap={2}>
        {values.selectedVariants.map((variant, index) => (
          <Stack direction="row" spacing={2} alignItems="center" key={index}>
            <FormControl fullWidth>
              <Select
                defaultValue={variant.name}
                value={variant.name}
                onChange={(event) => handleVariantChange(index, event)}
                renderValue={(selected) => selected}
              >
                {availableVariants.map((variantOption) => (
                  <MenuItem key={variantOption.name} value={variantOption.name}>
                    {variantOption.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {variant.name && (
              <FormControl fullWidth>
                <InputLabel>{`Values for ${variant.name}`}</InputLabel>
                <Select
                  multiple
                  value={variant.value}
                  onChange={(event) => handleVariantValueChange(index, event)}
                  input={<OutlinedInput label={`Values for ${variant.name}`} />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {variants
                    .find((v) => v.name === variant.name)
                    ?.values.map((value) => (
                      <MenuItem key={value} value={value}>
                        <Checkbox checked={variant.value.includes(value)} />
                        <ListItemText primary={value} />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
            <IconButton onClick={() => handleRemoveVariant(index)}>
              <MdDelete />
            </IconButton>
          </Stack>
        ))}
        {availableVariants.length > 0 && (
          <Button onClick={handleAddVariant} variant="contained">
            Add Variant
          </Button>
        )}
      </Stack>
      <Divider sx={{ mt: 3 }} />
      {values.variants?.map((item, i) => (
        <div key={item.name}>
          <Typography variant="h3" color="text.primary" sx={{ textTransform: 'uppercase', py: 2 }}>
            {i + 1}. {item.name}
          </Typography>
          <Stack sx={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto', gridGap: 16 }}>
            <Stack gap={1}>
              <Typography variant="overline" component={'label'} htmlFor="stockQuantity">
                {'Stock Quantity'}
              </Typography>
              <TextField
                id="stockQuantity"
                fullWidth
                type="number"
                {...getFieldProps(`variants[${i}].stockQuantity`)}
                error={Boolean(touched.variants?.[i]?.stockQuantity && errors.variants?.[i]?.stockQuantity)}
                helperText={touched.variants?.[i]?.stockQuantity && errors.variants?.[i]?.stockQuantity}
              />
            </Stack>

            <Stack gap={1}>
              <Typography variant="overline" component={'label'} htmlFor="regular-price">
                {'Regular Price'}
              </Typography>
              <TextField
                id="regular-price"
                fullWidth
                placeholder="0.00"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {fCurrency(0)
                        .replace(/\d+(\.\d+)?/g, '')
                        .trim()}
                    </InputAdornment>
                  ),
                  type: 'number'
                }}
                {...getFieldProps(`variants[${i}].price`)}
                error={Boolean(touched.variants?.[i]?.price && errors.variants?.[i]?.price)}
                helperText={touched.variants?.[i]?.price && errors.variants?.[i]?.price}
              />
            </Stack>
            <Stack gap={1}>
              <Typography variant="overline" component={'label'} htmlFor="sale-price">
                {'Sale Price'}
              </Typography>
              <TextField
                id="sale-price"
                fullWidth
                placeholder="0.00"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {fCurrency(0)
                        .replace(/\d+(\.\d+)?/g, '')
                        .trim()}
                    </InputAdornment>
                  ),
                  type: 'number'
                }}
                {...getFieldProps(`variants[${i}].salePrice`)}
                error={Boolean(touched.variants?.[i]?.salePrice && errors.variants?.[i]?.salePrice)}
                helperText={touched.variants?.[i]?.salePrice && errors.variants?.[i]?.salePrice}
              />
            </Stack>
            <Stack gap={1}>
              <Typography variant="overline" component={'label'} htmlFor="sku">
                {'SKU'}
              </Typography>
              <TextField
                id="sku"
                fullWidth
                {...getFieldProps(`variants[${i}].sku`)}
                error={Boolean(touched.variants?.[i]?.sku && errors.variants?.[i]?.sku)}
                helperText={touched.variants?.[i]?.sku && errors.variants?.[i]?.sku}
              />
            </Stack>
          </Stack>
          <div>
            <Stack gap={1}>
              <Typography variant="overline" component={'label'} htmlFor="product-image">
                {'Product Images'} <span>1080 * 1080</span>
              </Typography>
              <UploadMultiFile
                id="product-image"
                showPreview
                maxSize={3145728}
                accept="image/*"
                files={values?.variants[i].images}
                loading={loading === i}
                onDrop={(files) => handleDrop(files, i)}
                onRemove={(file) => handleRemove(file, i)}
                onRemoveAll={() => handleRemoveAll(i)}
                blob={values?.variants[i]?.blob}
                error={Boolean(touched?.variants?.[i]?.images && errors?.variants?.[i]?.images)}
              />
            </Stack>
            {touched?.variants?.[i]?.images && errors?.variants?.[i]?.images && (
              <FormHelperText error sx={{ px: 2 }}>
                {errors?.variants?.[i]?.images}
              </FormHelperText>
            )}
          </div>
          {isDigital && (
            <Stack gap={1}>
              <Typography variant="overline" component={'label'} htmlFor="downloadLink">
                {'Download Link'}
              </Typography>
              <TextField
                id="downloadLink"
                fullWidth
                placeholder="https://example.com/file.zip"
                {...getFieldProps(`variants[${i}].downloadLink`)}
                error={Boolean(touched?.variants?.[i]?.downloadLink && errors?.variants?.[i]?.downloadLink)}
                helperText={touched?.variants?.[i]?.downloadLink && errors?.variants?.[i]?.downloadLink}
              />
            </Stack>
          )}
        </div>
      ))}
    </CardContent>
  );
}
