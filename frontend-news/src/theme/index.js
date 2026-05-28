'use client';

import { createTheme } from '@mui/material/styles';

// custom theme imports
import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import shape from './shape';
import shadows, { customShadows } from './shadows';
import componentsOverride from './overrides';
// import colorPresets from './presets';
import tinycolor from 'tinycolor2';
export const getTheme = (mode, direction, selectedFont, adminPalette) => {
  const darkPalette = {
    ...palette.dark,
    primary: {
      ...palette.dark.primary,
      light: tinycolor(adminPalette.primary).lighten(20).toString(),
      main: adminPalette.primary,
      dark: tinycolor(adminPalette.primary).darken(20).toString()
    },
    secondary: {
      ...palette.dark.secondary,
      light: tinycolor(adminPalette.secondary).lighten(20).toString(),
      main: adminPalette.secondary,
      dark: tinycolor(adminPalette.secondary).darken(20).toString()
    },
    background: {
      ...palette.dark.background,
      paper: adminPalette.paperDark,
      default: adminPalette.defaultDark
    }
  };
  const lightPalette = {
    ...palette.light,
    primary: {
      ...palette.light.primary,
      light: tinycolor(adminPalette.primary).lighten(20).toString(),
      main: adminPalette.primary,
      dark: tinycolor(adminPalette.primary).darken(20).toString()
    },
    secondary: {
      ...palette.light.secondary,
      light: tinycolor(adminPalette.secondary).lighten(20).toString(),
      main: adminPalette.secondary,
      dark: tinycolor(adminPalette.secondary).darken(20).toString()
    },
    background: {
      ...palette.light.background,
      paper: adminPalette.paperLight,
      default: adminPalette.defaultLight
    }
  };

  const isDark = mode === 'dark';

  const themeOptions = {
    palette: {
      ...(isDark ? darkPalette : lightPalette),
      mode
    },
    direction,
    typography: {
      ...typography,
      fontFamily: selectedFont.style.fontFamily
    },
    shadows: isDark ? shadows.dark : shadows.light,
    customShadows: isDark ? customShadows.dark : customShadows.light,
    shape,
    breakpoints
  };

  const theme = createTheme(themeOptions);

  theme.components = componentsOverride(theme);

  return theme;
};
