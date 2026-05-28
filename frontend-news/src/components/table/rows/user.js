import PropTypes from 'prop-types';
import { enUS } from 'date-fns/locale';
import { useRouter } from '@bprogress/next';

// mui
import { styled } from '@mui/material/styles';
import {
  Box,
  TableRow,
  Skeleton,
  TableCell,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Tooltip,
  Chip
} from '@mui/material';

// utils
import { fDateShort } from '@/utils/format-time';

// icons
import { FiEye } from 'react-icons/fi';
import { LuUser } from 'react-icons/lu';
import { FaUserCheck } from 'react-icons/fa6';
import { HiSwitchHorizontal } from 'react-icons/hi';

// component
import BlurImage from '@/components/blur-image';

UserRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    cover: PropTypes.shape({
      url: PropTypes.string.isRequired
    }),
    firstName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    totalOrders: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
    status: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date).isRequired
  }).isRequired,
  setId: PropTypes.func.isRequired,
  setStatusId: PropTypes.func.isRequired
};

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  objectFit: 'cover',
  marginRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadiusSm,
  position: 'relative',
  overflow: 'hidden'
}));
export default function UserRow({ isLoading, row, setId, setStatusId }) {
  const router = useRouter();

  // Status badge component
  const StatusBadge = ({ status }) => {
    if (status === 'active') {
      return <Chip label="Active" size="small" color="success" variant="filled" sx={{ textTransform: 'capitalize' }} />;
    }
    if (status === 'inactive') {
      return <Chip label="Inactive" size="small" color="error" variant="filled" sx={{ textTransform: 'capitalize' }} />;
    }
    return (
      <Chip
        label={status || 'Unknown'}
        size="small"
        color="default"
        variant="outlined"
        sx={{ textTransform: 'capitalize' }}
      />
    );
  };

  return (
    <TableRow hover key={Math.random()}>
      <TableCell component="th" scope="row">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isLoading ? (
            <Skeleton variant="circular" width={40} height={40} />
          ) : row?.cover?.url ? (
            <ThumbImgStyle>
              <BlurImage priority fill alt={row?.firstName + ' thumbnail'} src={row?.cover?.url} objectFit="cover" />
            </ThumbImgStyle>
          ) : (
            <Avatar color="primary" sx={{ mr: 1 }}>
              {row?.firstName.slice(0, 1)}
            </Avatar>
          )}
          <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.firstName}
          </Typography>
        </Box>
      </TableCell>
      <TableCell style={{ minWidth: 160 }}>{isLoading ? <Skeleton variant="text" /> : row?.email}</TableCell>
      <TableCell style={{ minWidth: 80 }}>{isLoading ? <Skeleton variant="text" /> : row?.phone}</TableCell>
      <TableCell style={{ minWidth: 40 }}>{isLoading ? <Skeleton variant="text" /> : row?.totalOrders || 0}</TableCell>
      <TableCell style={{ minWidth: 40, textTransform: 'capitalize' }}>
        {isLoading ? <Skeleton variant="text" /> : row.role}
      </TableCell>
      <TableCell style={{ minWidth: 80 }}>
        {isLoading ? <Skeleton variant="text" /> : <StatusBadge status={row?.status} />}
      </TableCell>
      <TableCell style={{ minWidth: 40 }}>
        {isLoading ? <Skeleton variant="text" /> : fDateShort(row.createdAt, enUS)}
      </TableCell>
      <TableCell>
        <Stack direction="row" justifyContent="flex-end" gap={1}>
          {isLoading ? (
            <>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
            </>
          ) : (
            <>
              {row.role === 'vendor' ? null : row.role === 'super-admin' ? (
                <IconButton disabled onClick={() => router.push(`/admin/users/${row?._id}`)}>
                  <FaUserCheck />
                </IconButton>
              ) : (
                <Tooltip title={row.role === 'admin' ? 'Remove an admin' : 'Make an admin'}>
                  <IconButton
                    onClick={() => {
                      setId(row._id);
                    }}
                  >
                    {row.role === 'admin' ? <FaUserCheck /> : <LuUser />}
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title={`${row?.status === 'active' ? 'Deactivate' : 'Activate'} user`}>
                <IconButton
                  onClick={() => {
                    setStatusId(row._id);
                  }}
                  color={row?.status === 'active' ? 'warning' : 'success'}
                >
                  <HiSwitchHorizontal />
                </IconButton>
              </Tooltip>

              <Tooltip title="Preview">
                <IconButton onClick={() => router.push(`/admin/users/${row?._id}`)}>
                  <FiEye />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
