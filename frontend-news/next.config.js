'use client';

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {

  turbopack: {
    root: path.join(__dirname, '')
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  },

  // ADD THIS
  async rewrites() {
    return [

      {
        source: '/about-us',
        destination: '/about',
      },

      {
        source: '/contact-us',
        destination: '/contact',
      },
		
	  {
        source: '/book-pandit-online',
        destination: '/shops',
      },
		
	  {
        source: '/puja-products-online-store',
        destination: '/products',
      },
		
	  {
        source: '/puja-product-brands-online',
        destination: '/brands',
      },

	  {
        source: '/online-puja-services',
        destination: '/services',
      },

    ];
  },

  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com'
      },
      {
        hostname: 'res.cloudinary.com'
      },
      {
        hostname: 'adhyatmah.vercel.app'
      },
      {
        hostname: 'adhyatmah-fe-staging.vercel.app'
      },
      {
        hostname: 'example.com'
      },
      {
        hostname: 'adhyatmah.com'
      },
      {
        hostname: 'www.adhyatmah.com'
      },
      {
        hostname: 'cdn.shopify.com'
      },
      {
        hostname: 'shopify.com'
      }
    ]
  }

};

module.exports = nextConfig;