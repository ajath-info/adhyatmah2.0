function pxToRem(value) {
  return `${value / 16}rem`;
}

function responsiveFontSizes({ sm, md, lg }) {
  return {
    '@media (max-width:600px)': {
      fontSize: pxToRem(sm)
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md)
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg)
    }
  };
}

const typography = {
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  fontWeightExtraBold: 800,
  fontWeightBlack: 900,

  h1: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 700,
    lineHeight: 1.2,
    fontSize: pxToRem(36),
    letterSpacing: 0,
    textTransform: 'none',
    ...responsiveFontSizes({ sm: 28, md: 32, lg: 36 })
  },
  h2: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 600,
    lineHeight: 1.3,
    fontSize: pxToRem(24),
    letterSpacing: 0,
    textTransform: 'none',
    ...responsiveFontSizes({ sm: 20, md: 22, lg: 24 })
  },
  h3: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 600,
    lineHeight: 1.4,
    fontSize: pxToRem(18),
    letterSpacing: 0,
    textTransform: 'none',
    ...responsiveFontSizes({ sm: 16, md: 17, lg: 18 })
  },
  h4: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  },
  h5: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
    lineHeight: 1.5,
    fontSize: pxToRem(14),
    letterSpacing: 0,
    textTransform: 'none'
  },
  h6: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
    lineHeight: 1.5,
    fontSize: pxToRem(13),
    letterSpacing: 0,
    textTransform: 'none'
  },
  a: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(14),
    letterSpacing: 0,
    textTransform: 'none'
  },
  p: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.7,
    fontSize: pxToRem(14),
    letterSpacing: 0,
    textTransform: 'none'
  },
  subtitle: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
    letterSpacing: 0,
    textTransform: 'none'
  },
  subtitle1: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
    letterSpacing: 1,
    textTransform: 'none'
  },
  subtitle2: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(14),
    letterSpacing: 0,
    textTransform: 'none'
  },
  body: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.7,
    fontSize: pxToRem(14),
    letterSpacing: 0,
    textTransform: 'none'
  },
  body1: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.7,
    fontSize: pxToRem(14),
    letterSpacing: 1,
    textTransform: 'none'
  },
  body2: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.6,
    fontSize: pxToRem(13),
    letterSpacing: 0,
    textTransform: 'none'
  },
  caption: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    letterSpacing: 0,
    textTransform: 'none'
  },
  overline: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.4,
    fontSize: pxToRem(11),
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  button: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 700,
    lineHeight: 1.2,
    fontSize: pxToRem(13),
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  navigation: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(14),
    letterSpacing: 0.3,
    textTransform: 'capitalize'
  },
  price: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 700,
    lineHeight: 1.2,
    fontSize: pxToRem(18),
    letterSpacing: 0,
    textTransform: 'none'
  },
  priceStrikethrough: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.2,
    fontSize: pxToRem(16),
    letterSpacing: 0,
    textTransform: 'none',
    textDecoration: 'line-through',
    opacity: 0.7
  }
};

export default typography;
