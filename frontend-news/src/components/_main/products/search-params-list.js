'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Stack, Chip, Button } from '@mui/material';
import { MdDelete } from 'react-icons/md';

const FilterChips = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [chips, setChips] = useState([]);

  useEffect(() => {
    const entries = Array.from(searchParams.entries());
    const result = [];

    for (const [key, value] of entries) {
      if (!value) continue;

      const values = value.split('_'); // split multiple values
      values.forEach((val) => {
        result.push({ key, value: val });
      });
    }

    setChips(result);
  }, [searchParams]);

  const removeChip = ({ key, value }) => {
    const params = new URLSearchParams(searchParams);
    const currentValue = params.get(key);

    if (!currentValue) return;

    const values = currentValue.split('_').filter((v) => v !== value);

    if (values.length === 0) {
      params.delete(key);
    } else {
      params.set(key, values.join('_'));
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    router.push(pathname);
  };

  if (chips.length === 0) return null;

  return (
    <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center" mt={2}>
      {chips.map((chip, index) => (
        <Chip
          key={`${chip.key}-${chip.value}-${index}`}
          label={`${chip.key}: ${chip.value}`}
          onDelete={() => removeChip(chip)}
          sx={{ textTransform: 'capitalize' }}
        />
      ))}
      <Button onClick={clearAll} endIcon={<MdDelete />} variant="outlined" color="primary" size="small">
        Clear All
      </Button>
    </Stack>
  );
};

export default FilterChips;
