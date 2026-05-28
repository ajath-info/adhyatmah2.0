import VendorProfileClient from './VendorProfileClient';

import * as api from 'src/services';

import panditSeo from 'src/data/panditSeo';

const createVendorSlug = (vendor) => {

  const fullName = [
    vendor?.firstName || '',
    vendor?.lastName || ''
  ].join(' ');

  let slug = fullName

    .toLowerCase()

    .replace(/[^\x00-\x7F]/g, '')

    .replace(/\./g, '')

    .replace(/[^a-z0-9\s-]/g, '')

    .replace(/\s+/g, '-')

    .replace(/-+/g, '-')

    .replace(/^-|-$/g, '');

  if (!slug) {

    slug = `pandit-${vendor?.id}`;

  }

  return slug;
};

export async function generateMetadata({ params }) {

  // const slug = params.slug;
  const { slug } = await params;

const seoData =
  panditSeo[slug];

  try {

    const response =
      await api.getAllPandit();

    const vendors =
      response?.payload?.vendors || [];

    const vendor =
      vendors.find((item) =>
        createVendorSlug(item) === slug
      );

    if (!vendor) {

      return {
        title: 'Pandit Profile | Adhyatmah'
      };

    }

    const fullName =
      `${vendor.firstName || ''} ${vendor.lastName || ''}`.trim();

    return {

  title:
    seoData?.title ||
    `${fullName} | Book Verified Pandit Online`,

  description:
    seoData?.description ||
    `Book ${fullName} for puja, havan, grah shanti and Hindu rituals.`,

  openGraph: {

    title:
      seoData?.title ||
      `${fullName} | Adhyatmah`,

    description:
      seoData?.description ||

      `Book ${fullName} for Vedic puja services.`,

    images: [
      {
        url: vendor?.profileImage
      }
    ]
  }

};

  } catch (error) {

    return {
      title: 'Pandit Profile | Adhyatmah'
    };

  }

}

export default function Page() {

  return <VendorProfileClient />;

}