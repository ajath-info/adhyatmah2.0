import PropTypes from 'prop-types';
import { useRouter } from '@bprogress/next';
import { enUS } from 'date-fns/locale';
import Link from '@/utils/link';
import { useState, useEffect } from 'react';

// mui
import {
  Box,
  TableRow,
  Skeleton,
  TableCell,
  Typography,
  Stack,
  IconButton,
  Rating,
  Tooltip,
  Chip
} from '@mui/material';

// redux
import { fDateShort } from '@/utils/format-time';
import toast from 'react-hot-toast';
import BlurImage from '@/components/blur-image';

// icons
import { MdEdit, MdDelete } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';

import { useSelector } from '@/redux';
import { useCurrencyFormat } from '@/hooks/use-currency-format';

/* ================= TOKEN UTILS ================= */

function getToken() {
  if (typeof window === 'undefined') return '';
  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : '';
}

/* ================= API ================= */

const changeProductStatus = async (slug, status) => {
  const token = getToken();
  if (!token) throw new Error('Auth token missing');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${slug}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Failed to update status');
  }

  return res.json();
};

/* ================= COMPONENT ================= */

export default function ProductRow({ isLoading, row, handleClickOpen, isVendor }) {
  const router = useRouter();
  const { currency } = useSelector((state) => state.settings);
  const fCurrency = useCurrencyFormat('base');

  // ✅ LOCAL STATE FOR STATUS
  const [status, setStatus] = useState(row?.status);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // 🔄 Sync when row changes (pagination / refetch)
  useEffect(() => {
    setStatus(row?.status);
  }, [row?.status]);

  return (
    <TableRow hover>
      {/* PRODUCT */}
      <TableCell sx={{ maxWidth: 300 }}>
        <Box display="flex" alignItems="center">
          {isLoading ? (
            <Skeleton variant="rectangular" width={50} height={50} />
          ) : (
            <Box sx={{ width: 50, height: 50, mr: 2, position: 'relative' }}>
              <BlurImage alt={row?.name} src={row?.image.url} layout="fill" />
            </Box>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton width={120} /> : row?.name}
          </Typography>
        </Box>
      </TableCell>

      {/* PRICE */}
      <TableCell>{isLoading ? <Skeleton /> : fCurrency(row?.salePrice || row?.price, currency)}</TableCell>

      {/* STOCK */}
      <TableCell>
        {isLoading ? (
          <Skeleton />
        ) : (
          <Chip
            size="small"
            label={row?.stockQuantity < 1 ? 'Out of stock' : row?.stockQuantity < 20 ? 'Low stock' : 'In stock'}
            color={row?.stockQuantity < 1 ? 'error' : row?.stockQuantity < 20 ? 'warning' : 'success'}
          />
        )}
      </TableCell>

      {/* STATUS */}
      <TableCell>
        {isLoading ? (
          <Skeleton />
        ) : (
          <select
            value={status}
            disabled={loadingStatus}
            onChange={async (e) => {
              const newStatus = e.target.value;
              const oldStatus = status;

              setStatus(newStatus); // optimistic UI
              setLoadingStatus(true);

              try {
                await changeProductStatus(row.slug, newStatus);
                toast.success('Status updated');
              } catch (err) {
                setStatus(oldStatus); // rollback
                toast.error(err.message || 'Update failed');
              } finally {
                setLoadingStatus(false);
              }
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: loadingStatus ? 'not-allowed' : 'pointer'
            }}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
          </select>
        )}
      </TableCell>

      {/* RATING */}
      <TableCell>
        {isLoading ? <Skeleton /> : <Rating value={row?.averageRating || 0} readOnly size="small" />}
      </TableCell>

      {/* DATE */}
      <TableCell>{isLoading ? <Skeleton /> : fDateShort(row?.createdAt, enUS)}</TableCell>

      {/* ACTIONS */}
      <TableCell align="right">
        {isLoading ? (
          <Skeleton width={100} />
        ) : (
          <Stack direction="row" justifyContent="flex-end">
            <Tooltip title="Preview">
              <Link target="_blank" href={`/product/${row.slug}`}>
                <IconButton>
                  <IoEye />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton onClick={() => router.push(`/${isVendor ? 'vendor' : 'admin'}/products/${row.slug}`)}>
                <MdEdit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={handleClickOpen(row.slug)}>
                <MdDelete />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
}

/* ================= PROPS ================= */

ProductRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.object.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  isVendor: PropTypes.bool
};
