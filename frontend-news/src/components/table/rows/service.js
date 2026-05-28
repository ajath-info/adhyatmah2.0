import PropTypes from 'prop-types';
import { useRouter } from '@bprogress/next';
import Link from '@/utils/link';
// mui
import {
  Box,
  TableRow,
  Skeleton,
  TableCell,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';

// redux
import { fDateShort } from '@/utils/format-time';

// icons
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';

import { useSelector } from '@/redux';
import { useCurrencyFormat } from '@/hooks/use-currency-format';

export default function ServiceRow({ isLoading, row, handleClickOpen, isVendor }) {
  const router = useRouter();
  const { currency } = useSelector((state) => state.settings);
  const fCurrency = useCurrencyFormat('base');

  return (
    <TableRow hover key={Math.random()}>
      <TableCell component="th" scope="row" sx={{ maxWidth: 300 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isLoading ? (
            <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                width: 50,
                height: 50,
                bgcolor: 'background.default',
                mr: 2,
                border: (theme) => '1px solid ' + theme.palette.divider,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: 'primary.main'
              }}
            >
              ॐ
            </Box>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.poojaType}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        {isLoading ? <Skeleton variant="text" /> : fCurrency(row?.price, currency)}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
            {row?.duration}
          </Typography>
        )}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip
            size="small"
            label="Available"
            color="success"
          />
        )}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
            {row?.description}
          </Typography>
        )}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          fDateShort(row?.createdAt)
        )}
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <>
              <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={34} height={34} />
            </>
          ) : (
            <>
              <Tooltip title="View">
                <IconButton
                  component={Link}
                  href={`/vendor/services/${row?._id}`}
                  size="small"
                >
                  <IoEye />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  component={Link}
                  href={`/vendor/services/${row?._id}/edit`}
                  size="small"
                >
                  <MdEdit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={handleClickOpen(row?._id)} size="small">
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

ServiceRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    poojaType: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  isVendor: PropTypes.bool
};
