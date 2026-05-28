import React from 'react';
import PropTypes from 'prop-types';

// mui
import { TableRow, Skeleton, TableCell, Stack, IconButton, Tooltip, Chip } from '@mui/material';

// components

// icons
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';

export default function BrandsRow({ isLoading, row, handleClickOpen, onClickEdit }) {
  return (
    <TableRow hover key={Math.random()}>
      <TableCell>
        <Stack direction="row" gap={1} alignItems={'center'}>
          {isLoading ? <Skeleton variant="text" /> : row.name + ` (${row.code})`}{' '}
          {row?.base ? <Chip size="small" label={'Base'} color={'success'} /> : ''}
        </Stack>
      </TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : <> {row.country} </>}</TableCell>

      <TableCell>
        {isLoading ? <Skeleton variant="text" /> : <> {row.rate ? row.rate + ' ' + row.code : 'Default rate'} </>}
      </TableCell>

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip
            size="small"
            label={row?.status}
            color={row?.status?.toLowerCase() === 'active' ? 'success' : 'error'}
          />
        )}
      </TableCell>
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
              {!row?.base && (
                <Tooltip title="Delete">
                  <IconButton onClick={handleClickOpen(row._id)}>
                    <MdDelete />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
BrandsRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
    createdAt: PropTypes.string,
    country: PropTypes.string,
    code: PropTypes.string,
    rate: PropTypes.string
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};
