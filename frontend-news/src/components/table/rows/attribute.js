import React from 'react';
import PropTypes from 'prop-types';

// mui
import { TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip } from '@mui/material';

// icons
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';

export default function AttributesRow({ isLoading, row, index, handleClickOpen, onClickEdit }) {
  return (
    <TableRow hover key={Math.random()}>
      <TableCell component="th" scope="row">
        <Typography variant="subtitle2" noWrap>
          {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : `#ID: ${index}`}
        </Typography>
      </TableCell>
      <TableCell component="th" scope="row">
        <Typography variant="subtitle2" noWrap>
          {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.name}
        </Typography>
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.values.slice(0, 8).join(', ')}</TableCell>
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <>
              <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={34} height={34} />
            </>
          ) : (
            <>
              <Tooltip title="Edit">
                <IconButton onClick={() => onClickEdit(row)}>
                  <MdEdit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={handleClickOpen(row._id)}>
                  <MdDelete />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
AttributesRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string,
    slug: PropTypes.string
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};
