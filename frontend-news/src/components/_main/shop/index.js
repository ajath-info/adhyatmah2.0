'use client';
import React, { useEffect } from 'react';
import { useRouter } from '@bprogress/next';
import { useSelector } from 'react-redux';
import ShopForm from '@/components/forms/shop';

export default function AdminShopMain() {
  const { user } = useSelector((state) => state.user);
  const router = useRouter();
  useEffect(() => {
    if (user?.role !== 'user') {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <ShopForm type="create-shop" />;
}
