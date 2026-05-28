import React from 'react';
import PropTypes from 'prop-types';
// mui
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Dialog } from '@mui/material';
import { HiSwitchHorizontal } from 'react-icons/hi';

export default function StatusDialog({ onClose, open, onClick, loading }) {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1,
          svg: {
            color: 'warning.main'
          }
        }}
      >
        <HiSwitchHorizontal /> Update Status
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure to update the status for this user?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}> Cancel </Button>
        <Button variant="contained" loading={loading} onClick={onClick}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
StatusDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};
