'use client';

// mui
import { GlobalStyles as GlobalThemeStyles } from '@mui/material';

export default function GlobalStyles() {
  return (
    <GlobalThemeStyles
      styles={{
        '*': {
          textDecoration: 'none',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box'
        },

        html: {
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch'
        },

        body: {
          width: '100%',
          height: '100%'
        },

        '#__next': {
          width: '100%',
          height: '100%'
        },

        a: {
          textDecoration: 'none',
          transition: 'color 0.3s ease'
        },

        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none'
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none'
            }
          }
        },
	  
		'ol': {
		paddingLeft: '22px',
		marginTop: '18px'
		},

		'ol li': {
		marginBottom: '1px',
		lineHeight: 1.5,
		fontSize: '14px',
		color: '#5f6b77'
		},

		'ol li strong': {
		color: '#2c2f33',
		fontWeight: 700
		},

		'ol li::marker': {
		fontWeight: 700,
		color: '#2c2f33'
		},

        /* 🔥 WhatsApp Floating Button */
        '.whatsapp-button': {
          position: 'fixed',
          bottom: '2%',
          left: '18px', // change to right: '18px' if needed
          backgroundColor: '#2ab540',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '2px 2px 10px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          zIndex: 9999,
          transition: 'transform 0.2s ease',

          '&:hover': {
            transform: 'scale(1.05)'
          }
        },

        '.whatsapp-button img': {
          width: '55px',
          height: 'auto'
        },

        /* Mobile safety */
        '@media (max-width:480px)': {
          '.whatsapp-button': {
            bottom: '80px'
          }
        },
	  
	  /* 🔥 Hide Google Translate Banner Completely */
'.goog-te-banner-frame': {
  display: 'none !important'
},

'.goog-te-banner-frame.skiptranslate': {
  display: 'none !important'
},

'iframe.goog-te-banner-frame': {
  display: 'none !important'
},

'.goog-tooltip': {
  display: 'none !important'
},

'.goog-text-highlight': {
  background: 'none !important',
  boxShadow: 'none !important'
},

'body': {
  width: '100%',
  height: '100%',
  top: '0px !important'
},
	  
      }}
    />
  );
}