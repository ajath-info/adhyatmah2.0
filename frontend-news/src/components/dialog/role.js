import React from 'react';
import PropTypes from 'prop-types';
// mui
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Dialog } from '@mui/material';
import { IoIosWarning } from 'react-icons/io';

export default function DeleteDialog({ onClose, open, onClick, loading }) {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1,
          svg: {
            color: 'error.main'
          }
        }}
      >
        <IoIosWarning /> Update role
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure to update the role for this user.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}> cancel </Button>
        <Button variant="contained" loading={loading} onClick={onClick}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
DeleteDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};
