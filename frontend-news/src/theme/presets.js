import palette from './palette';

const colorPresets = {
  default: {
    name: 'default',
    primary: {
      ...palette.dark.primary
    }
  },
  green: {
    name: 'green',
    primary: {
      light: '#66bb6a',
      main: '#43a047',
      dark: '#2e7d32',
      contrastText: '#fff'
    }
  },
  purple: {
    name: 'purple',
    primary: {
      light: '#ba68c8',
      main: '#7b1fa2',
      dark: '#4a0072',
      contrastText: '#fff'
    }
  },
  red: {
    name: 'red',
    primary: {
      light: '#e57373',
      main: '#d32f2f',
      dark: '#b71c1c',
      contrastText: '#fff'
    }
  },
  orange: {
    name: 'orange',
    primary: {
      light: '#ffb74d',
      main: '#ed6c02',
      dark: '#e65100',
      contrastText: '#fff'
    }
  },
  cyan: {
    name: 'cyan',
    primary: {
      light: '#4dd0e1',
      main: '#00acc1',
      dark: '#00838f',
      contrastText: '#fff'
    }
  }
};

export default colorPresets;
