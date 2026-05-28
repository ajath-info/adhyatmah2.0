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
  Chip,
  Avatar
} from '@mui/material';

// redux
import { fDateShort } from '@/utils/format-time';

// icons
import { MdEdit } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';

import { useSelector } from '@/redux';
import { useCurrencyFormat } from '@/hooks/use-currency-format';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'accept':
      return 'info';
    case 'ongoing':
      return 'primary';
    case 'upcoming':
      return 'secondary';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'accept':
      return 'Accepted';
    case 'ongoing':
      return 'Ongoing';
    case 'upcoming':
      return 'Upcoming';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export default function BookingRow({ isLoading, row, handleClickOpen, isVendor }) {
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
            <Skeleton variant="circular" width={40} height={40} />
          ) : (
            <Avatar
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                bgcolor: 'primary.main',
                fontSize: '16px'
              }}
            >
              {row?.customer?.firstName?.charAt(0) || 'U'}
            </Avatar>
          )}
          <Box>
            <Typography variant="subtitle2" noWrap>
              {isLoading ? (
                <Skeleton variant="text" width={120} />
              ) : (
                `${row?.customer?.firstName || ''} ${row?.customer?.lastName || ''}`.trim()
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isLoading ? (
                <Skeleton variant="text" width={80} />
              ) : (
                row?.customer?.email || ''
              )}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Typography variant="subtitle2" color="primary">
            {fCurrency(row?.paymentAmount, currency)}
          </Typography>
        )}
      </TableCell>

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Box>
            <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
              {row?.poojaType}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row?.package}
            </Typography>
          </Box>
        )}
      </TableCell>

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Typography variant="body2" noWrap>
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
            label={getStatusLabel(row?.status)}
            color={getStatusColor(row?.status)}
            variant="filled"
          />
        )}
      </TableCell>

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Box>
            <Typography variant="body2">
              {fDateShort(row?.dateTime)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row?.bookingID}
            </Typography>
          </Box>
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
              <Tooltip title="View Details">
                <IconButton
                  component={Link}
                  href={`/vendor/bookings/${row?._id}`}
                  size="small"
                >
                  <IoEye />
                </IconButton>
              </Tooltip>
              <Tooltip title="Update Status">
                <IconButton
                  onClick={() => handleClickOpen(row?._id)}
                  size="small"
                >
                  <MdEdit />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}

BookingRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    bookingID: PropTypes.string.isRequired,
    poojaType: PropTypes.string.isRequired,
    package: PropTypes.string.isRequired,
    dateTime: PropTypes.instanceOf(Date).isRequired,
    duration: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    paymentAmount: PropTypes.number.isRequired,
    customer: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string
    }),
    createdAt: PropTypes.instanceOf(Date).isRequired
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  isVendor: PropTypes.bool
};
