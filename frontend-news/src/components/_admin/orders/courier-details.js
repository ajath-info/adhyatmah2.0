'use client';
import { CardContent, CardHeader, Card, TextField, Stack, Button } from '@mui/material';

import React from 'react';
import { toast } from 'react-hot-toast';
import * as api from 'src/services';
import { useMutation } from '@tanstack/react-query';
function validateURL(url) {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.?)+[a-zA-Z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IPv4
      '(\\:\\d+)?' + // port
      '(\\/[-a-zA-Z\\d%_.~+]*)*' + // path
      '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-zA-Z\\d_]*)?$' // fragment locator
  );

  return urlPattern.test(url);
}

export default function CourierDetails({ id, courierInfo }) {
  const [state, setState] = React.useState({ courierName: '', trackingId: '', trackingLink: '' });

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: courierInfo ? api.updateCourierInfo : api.createCourierInfo,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: () => {
      toast.error('Something went wrong!');
    }
  });

  const onClick = () => {
    mutate({ ...state, orderId: id });
  };
  React.useEffect(() => {
    if (Boolean(courierInfo)) {
      const {
        vendorId: _vendorId,
        shopId: _shopId,
        orderId: _orderId,
        updatedAt: _updatedAt,
        createAt: _createAt,
        ...rest
      } = courierInfo;
      setState({ ...rest });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courierInfo]);
  console.log(state, 'courierInfo');
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader title="Courier information" />
      <CardContent>
        <Stack gap={2}>
          <TextField
            value={state.courierName}
            onChange={(e) => setState({ ...state, courierName: e.target.value })}
            label="Courier Name"
            variant="outlined"
            fullWidth
          />
          <TextField
            value={state.trackingId}
            onChange={(e) => setState({ ...state, trackingId: e.target.value })}
            label="Tracking ID"
            variant="outlined"
            fullWidth
          />
          <TextField
            value={state.trackingLink}
            onChange={(e) => setState({ ...state, trackingLink: e.target.value })}
            label="Tracking Link"
            variant="outlined"
            fullWidth
          />
          <Button
            onClick={onClick}
            variant="contained"
            color="primary"
            size="large"
            loading={isLoading}
            disabled={
              !Boolean(state.courierName) || !Boolean(state.trackingId) || !Boolean(validateURL(state.trackingLink))
            }
          >
            Save
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
