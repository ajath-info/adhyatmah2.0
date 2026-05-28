export default function Chip() {
  // const isLight = theme.palette.mode === 'light';

  return {
    MuiChip: {
      styleOverrides: {
        root: {
          span: { fontWeight: 700, textTransform: 'capitalize' }
        }
      }
    }
  };
}
