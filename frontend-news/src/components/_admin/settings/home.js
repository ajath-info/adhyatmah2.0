'use client';
import React from 'react';
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
import HomeSettingsForm from '@/components/forms/settings/home-form';
export default function HomeMain() {
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['get-home-settings-by-admin'],
    queryFn: () => api.getHomeSettingsByAdmin()
  });

  return <HomeSettingsForm data={data?.data} isLoading={isLoading} />;
}
