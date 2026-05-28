import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from '@bprogress/next';
import { useSearchParams } from 'next/navigation';
// mui
import { FormGroup, FormControlLabel, Checkbox, Grid, Typography, Button, Zoom, Stack } from '@mui/material';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function Size({ ...props }) {
  const { values, path, keyName } = props;
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const selectedParams = searchParams.get(keyName);
  const [state, setstate] = useState({
    selected: [],
    isLoaded: false
  });

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const deleteQueryString = useCallback(
    (name) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      return params.toString();
    },
    [searchParams]
  );

  const handleChange = (props, e) => {
    var data = state.selected;
    if (e.target.checked) {
      data = [...data, props];
      setstate({ ...state, selected: [...state.selected, props] });
      push(`${path}?` + createQueryString(keyName, [...state.selected, props].join('_')));
    } else {
      const index = data.indexOf(props);
      data.splice(index, 1);
      if (data.length > 0) {
        const filtered = state.selected.filter((selected) => selected !== props);
        setstate({ ...state, selected: filtered });
        push(`${path}?` + createQueryString(keyName, filtered.join('_')));
      } else {
        const deleted = deleteQueryString('gender');
        path + '?' + deleted;
      }
    }
  };

  useEffect(() => {
    if (Boolean(selectedParams)) {
      setstate({
        ...state,
        selected: [...selectedParams.split('_')]
      });
    } else {
      setstate({
        ...state,
        selected: [],
        isLoaded: true
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedParams]);
  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            mb: 1,
            display: 'flex',
            gap: 1
          }}
          color="text.primary"
        >
          {keyName} {Boolean(state.selected.length) && selectedParams && '(' + selectedParams?.split('_').length + ')'}
        </Typography>
        <Zoom in={Boolean(state.selected.length)}>
          <Button
            onClick={() => {
              setstate({ ...state, selected: [] });
              `${path}?${deleteQueryString(keyName)}`;
            }}
            variant="outlined"
            color="primary"
            size="small"
            sx={{ float: 'right', mt: '-3px' }}
          >
            Reset
          </Button>
        </Zoom>
      </Stack>

      <Grid container>
        {values?.map((v) => (
          <Grid key={Math.random()} size={6}>
            <FormGroup>
              <FormControlLabel
                sx={{ textTransform: 'capitalize' }}
                checked={state.selected.includes(v)}
                onChange={(e) => handleChange(v, e)}
                control={<Checkbox {...label} />}
                label={v}
              />
            </FormGroup>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
// add propTypes
Size.propTypes = {
  values: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  keyName: PropTypes.string.isRequired
};
