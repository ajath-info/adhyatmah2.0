import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
// mui
import { Box, Tooltip, Typography, Button, Stack, Zoom } from '@mui/material';
// icons
import { FaCheck } from 'react-icons/fa6';
// next
import { useRouter } from '@bprogress/next';
import { useSearchParams } from 'next/navigation';
// data
import { capitalCase } from 'change-case';

ColorsMain.propTypes = {
  path: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string),
  keyName: PropTypes.string.isRequired
};

export default function ColorsMain({ ...props }) {
  const { colors: filterColors, path, keyName } = props;
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const colors = searchParams.get(keyName);

  const [state, setstate] = useState({
    colors: [],
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
  const handleChange = (props, val) => () => {
    var data = state.colors;

    if (val) {
      data = [...data, props];

      setstate({ ...state, colors: [...data] });
      push(`${path}?` + createQueryString(keyName, [...state.colors, props].join('_')));
    } else {
      const index = data.indexOf(props);
      data.splice(index, 1);
      if (data.length > 0) {
        const filtered = state.colors.filter((colors) => colors !== props);
        setstate({ ...state, colors: filtered });
        push(`${path}?` + createQueryString(keyName, filtered.join('_')));
      } else {
        const deleted = deleteQueryString(keyName);
        push(path + '?' + deleted);
      }
    }
  };

  useEffect(() => {
    if (Boolean(colors)) {
      setstate({
        ...state,
        colors: [...colors.split('_')]
      });
    } else {
      setstate({
        ...state,
        colors: [],
        isLoaded: true
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]);
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
          {keyName} {Boolean(state.colors.length) && colors && '(' + colors?.split('_').length + ')'}
        </Typography>
        <Zoom in={Boolean(state.colors.length)}>
          <Button
            onClick={() => {
              setstate({ ...state, colors: [] });

              push(`${path}?${deleteQueryString(keyName)}`);
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

      <Stack gap={1} direction="row" sx={{ flexWrap: 'wrap', mt: 3 }}>
        {filterColors?.map((v) => (
          <Tooltip title={capitalCase(v)} key={v}>
            <Box
              key={v}
              sx={{
                cursor: 'pointer',
                width: 24,
                height: 24,
                bgcolor: v,
                borderRadius: '4px',
                border: (theme) =>
                  state.colors.includes(v)
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={handleChange(v, !state.colors.includes(v))}
            >
              {/* <Zoom in={state.colors.includes(v)}> */}
              {state.colors.includes(v) && <FaCheck color="primary" size={16} />}
              {/* </Zoom> */}
            </Box>
          </Tooltip>
        ))}
      </Stack>
    </>
  );
}
