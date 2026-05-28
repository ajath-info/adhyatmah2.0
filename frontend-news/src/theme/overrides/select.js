import { MdExpandMore } from 'react-icons/md';

// ----------------------------------------------------------------------

export default function Select(theme) {
  return {
    MuiSelect: {
      defaultProps: {
        IconComponent: MdExpandMore
      },

      styleOverrides: {
        root: {
          background: theme.palette.background.paper
        }
      }
    }
  };
}
