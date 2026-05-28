'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

// api
import * as api from 'src/services';
import { useQuery, useMutation } from '@tanstack/react-query';

// component
import Table from 'src/components/table/table';
import UserList from '@/components/table/rows/user';
import RoleDialog from 'src/components/dialog/role';
import StatusDialog from 'src/components/dialog/status';

const TABLE_HEAD = [
  { id: 'name', label: 'User' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'phone' },
  { id: 'orders', label: 'Orders' },
  { id: 'role', label: 'Role' },
  { id: 'status', label: 'Status' },
  { id: 'joined', label: 'Joined' },

  { id: '', label: 'Actions' }
];

export default function AdminProducts() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const roleParam = searchParams.get('role');
  const [count, setCount] = useState(0);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['user', pageParam, searchParam, roleParam, count],
    queryFn: () => api.getUserByAdminsByAdmin(+pageParam || 1, searchParam || '', roleParam || '')
  });
  const [id, setId] = useState(null);
  const [statusId, setStatusId] = useState(null);

  const { mutate, isPending: roleLoading } = useMutation({
    mutationFn: api.updateUserRoleByAdmin,
    onSuccess: (data) => {
      toast.success(data?.message || 'Role updated successfully');
      setCount((prev) => prev + 1);
      setId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update role');
      setId(null);
    }
  });

  const { mutate: mutateStatus, isPending: statusLoading } = useMutation({
    mutationFn: api.updateUserStatusByAdmin,
    onSuccess: (data) => {
      toast.success(data?.message || 'Status updated successfully');
      setCount((prev) => prev + 1);
      setStatusId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update status');
      setStatusId(null);
    }
  });

  return (
    <div>
      <RoleDialog open={Boolean(id)} onClose={() => setId(null)} onClick={() => mutate(id)} loading={roleLoading} />
      <StatusDialog
        open={Boolean(statusId)}
        onClose={() => setStatusId(null)}
        onClick={() => mutateStatus(statusId)}
        loading={statusLoading}
      />
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={UserList}
        setId={setId}
        setStatusId={setStatusId}
        id={setId}
        isSearch
        filters={[{ ...USER_ROLE_FILTERS }]}
      />
    </div>
  );
}
const USER_ROLE_FILTERS = {
  name: 'Role',
  param: 'role',
  data: [
    {
      name: 'Users',
      slug: 'user'
    },
    {
      name: 'Vendors',
      slug: 'vendor'
    },
    {
      name: 'Admins',
      slug: 'admin'
    }
  ]
};
