import React, { useState, useEffect } from 'react';
import { useRouter } from '@bprogress/next';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';

// mui
import {
  Divider,
  Card,
  Table,
  TableBody,
  TableContainer,
  Stack,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from '@mui/material';

// components
import NotFound from '@/illustrations/data-not-found';
import Pagination from 'src/components/pagination';
import Search from 'src/components/search';
import TableHead from './table-head';

CustomTable.propTypes = {
  headData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      alignRight: PropTypes.bool
    })
  ).isRequired,
  data: PropTypes.shape({
    data: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,

  mobileRow: PropTypes.elementType,
  row: PropTypes.elementType.isRequired,
  index: PropTypes.number.isRequired,
  filters: PropTypes.arr,
  isSearch: PropTypes.bool
};
export default function CustomTable({ ...props }) {
  const { headData, data, isLoading, isSearch, row, filters, ...rest } = props;
  const { replace } = useRouter();

  const searchParams = useSearchParams();
  const [state, setState] = useState({});
  const queryString = searchParams.toString();
  const handleChange = (param, val) => {
    const params = new URLSearchParams(searchParams);

    if (val === '') {
      params.delete(param); // Remove if empty
    } else {
      params.set(param, val); // Set new value
    }

    setState((prev) => ({ ...prev, [param]: val }));

    // Just replace the search params without changing pathname
    replace(`?${params.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams('?' + queryString);
    const paramsObject = {};
    for (const [key, value] of params.entries()) {
      paramsObject[key] = value;
    }
    setState({ ...state, ...paramsObject });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Component = row;
  return (
    <Card>
      <>
        {(isSearch || Boolean(filters?.length)) && (
          <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
            {isSearch ? <Search /> : null}{' '}
            {filters?.length ? (
              <Stack spacing={2} direction="row">
                {filters?.map((item) => (
                  <FormControl fullWidth key={Math.random()} sx={{ maxWidth: 200, minWidth: 140, width: '100%' }}>
                    <InputLabel id={'select-' + item.name}>{item.name}</InputLabel>
                    <Select
                      labelId={'select-' + item.name}
                      id={'select-' + item.name}
                      value={state[item.param] ?? ''}
                      label={item.name}
                      onChange={(e) => handleChange(item.param, e.target.value)}
                    >
                      <MenuItem value="">None</MenuItem>
                      {item.data.map((v) => (
                        <MenuItem value={v.slug} key={Math.random()}>
                          {v.name || v.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ))}
              </Stack>
            ) : null}
          </Stack>
        )}

        {!isLoading && data?.data?.length === 0 ? (
          <>
            <Divider />

            <NotFound title="No Order Found" />
          </>
        ) : (
          <>
            <TableContainer>
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead headData={headData} />
                <TableBody>
                  {(isLoading ? Array.from(new Array(6)) : (data?.data || [])).map((item, index) => {
                    return <Component key={Math.random()} row={item} index={index} isLoading={isLoading} {...rest} />;
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            {!isLoading && (
              <Pagination
                data={data}
                sx={{
                  my: 2
                }}
              />
            )}
          </>
        )}
      </>
    </Card>
  );
}
