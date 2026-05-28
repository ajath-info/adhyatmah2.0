'use client';
import React from 'react';
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
import MainSettingsForm from '@/components/forms/settings/main-form';
export default function SettingsMain() {
  const { data, isPending } = useQuery({
    queryKey: ['get-main-settings-by-admin'],
    queryFn: () => api.getMainSettingsByAdmin()
  });

  return <MainSettingsForm currentSetting={data?.data} isLoading={isPending} />;
}
