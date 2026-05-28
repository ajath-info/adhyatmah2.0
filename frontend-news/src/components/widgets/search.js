'use client';
import * as React from 'react';
// icons
import { IoSearchOutline } from 'react-icons/io5';
// mui
import { Dialog, alpha, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
// components
import Search from '@/components/dialog/search';

export default function SearchWidget(props) {
  const { multiSelect, selectedProducts, handleSave, open, setOpen, mobile } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return mobile ? (
    <Search mobile selectedProducts={[]} handleSave={handleSave} />
  ) : (
    <>
      {!multiSelect && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          onClick={handleClickOpen}
          sx={{
            p: 1,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 10,
            width: 500,
            height: 60,
            cursor: 'pointer'
          }}
        >
          <Typography variant="body1" color="text.secondary" ml={2}>
            Search...
          </Typography>
          <IconButton
            onClick={handleClickOpen}
            name="search"
            color="primary"
            sx={{
              outlineWidth: 1,
              outlineColor: 'primary',
              outlineStyle: 'solid',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
            }}
          >
            <IoSearchOutline />
          </IconButton>
        </Stack>
      )}

      <Dialog open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: 600 } }}>
        <Search
          onClose={handleClose}
          multiSelect={multiSelect}
          selectedProducts={selectedProducts}
          handleSave={handleSave}
        />
      </Dialog>
    </>
  );
}
