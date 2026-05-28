'use client';
import * as React from 'react';
import { useRouter } from '@bprogress/next';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
// mui
import { Menu, MenuItem, Button } from '@mui/material';
// mui lab

// icons
import { IoIosArrowDown } from 'react-icons/io';
// api
import * as api from 'src/services';
import { useMutation } from '@tanstack/react-query';

SelectOrderStatus.propTypes = { data: PropTypes.object.isRequired, isVendor: PropTypes.bool };

export default function SelectOrderStatus({ data, isVendor }) {
  const router = useRouter();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: isVendor ? api.updateOrderStatusByVendor : api.updateOrderStatus,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/admin/orders');
    },
    onError: () => {
      toast.error('Something went wrong!');
    }
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (props) => {
    setSelected(props);
    if (props !== selected) {
      mutate({ id: data?._id, status: props });
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        endIcon={<IoIosArrowDown />}
        sx={{ ml: 1 }}
        loading={isLoading || !data}
        loadingPosition="end"
      >
        {selected ? selected : data?.status || 'Loading'}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose(selected)}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        {['pending', 'on-the-way', 'delivered', 'returned', 'canceled'].map((status) => (
          <MenuItem sx={{ textTransform: 'capitalize' }} key={status} onClick={() => handleClose(status)}>
            {status}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
