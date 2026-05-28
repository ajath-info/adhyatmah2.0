import ShopDetailsForm from '@/components/forms/shop/shop-details';
import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
export default function ShopDetailsCard() {
  return (
    <Card>
      <CardHeader title="Shop details" />
      <CardContent>
        <ShopDetailsForm />
      </CardContent>
    </Card>
  );
}
