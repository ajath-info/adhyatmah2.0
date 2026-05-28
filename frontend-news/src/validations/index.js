import * as Yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';

const variantSchema = Yup.object().shape({
  name: Yup.string().required('Variant name is required'),
  variant: Yup.string().required('Product Variant is required'),
  sku: Yup.string().required('SKU is required'),
  price: Yup.number().required('Price is required'),
  salePrice: Yup.number().lessThan(Yup.ref('price'), 'Sale price should be less than price').nullable(),
  stockQuantity: Yup.number().required('Stock Quantity is required'),
  images: Yup.array().min(1, 'Please upload at least one image').required('Images are required'),

  downloadLink: Yup.string()
    .nullable()
    .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
    .when('$deliveryType', {
      is: 'digital',
      then: (schema) => schema.required('Download link is required for digital variants'),
      otherwise: (schema) => schema.notRequired()
    })
});

const productSchema = (isVendor) =>
  Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    tags: Yup.array().min(1, 'Tags is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    shop: isVendor ? Yup.string().nullable().notRequired() : Yup.string().required('Shop is required'),
    subCategory: Yup.string().required('Sub Category is required'),
    childCategory: Yup.string().required('Child Category is required'),
    slug: Yup.string().required('Slug is required'),
    brand: Yup.string(),
    metaTitle: Yup.string().required('Meta title is required'),
    metaDescription: Yup.string().required('Meta description is required'),
    type: Yup.string().required('Product type is required'),
    content: Yup.string().required('Content is required'),
    deliveryType: Yup.string(),
    downloadLink: Yup.string()
      .nullable()
      .transform((value, originalValue) => (originalValue?.trim() === '' ? null : value))
      .when(['deliveryType', 'type'], {
        is: (deliveryType, type) => deliveryType === 'digital' && type === 'simple',
        then: (schema) => schema.required('Download Link is required for simple digital products'),
        otherwise: (schema) => schema.notRequired()
      }),
    ...(!isVendor && { status: Yup.string().required('Status is required') }),

    images: Yup.array().min(1, 'Images is required'),
    sku: Yup.string().when('type', {
      is: 'simple',
      then: (schema) => schema.required('SKU is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    stockQuantity: Yup.number().when('type', {
      is: 'simple',
      then: (schema) => schema.required('Stock Quantity is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    price: Yup.number().when('type', {
      is: 'simple',
      then: (schema) => schema.required('Price is required'),
      otherwise: (schema) => schema.notRequired()
    }),

    salePrice: Yup.number()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .nullable()
      .when('type', {
        is: 'simple',
        then: (schema) => schema.lessThan(Yup.ref('price'), 'Sale price should be smaller than price'),
        otherwise: (schema) => schema.notRequired()
      }),
    demo: Yup.string(),
    width: Yup.string(),
    height: Yup.string(),
    length: Yup.string(),
    variants: Yup.array()
      .of(variantSchema)
      .when('type', {
        is: 'variable',
        then: (schema) => schema.min(1, 'At least one variant is required'),
        otherwise: (schema) => schema.notRequired()
      })
  });

const mainSettingsSchema = Yup.object().shape({
  businessName: Yup.string().required('Business Name is required'),
  domainName: Yup.string().required('Domain Name is required'),

  websiteStatus: Yup.string().required('Website Status is required'),
  offlineMessage: Yup.string().required('Offline Message is required'),

  seo: Yup.object().shape({
    metaTitle: Yup.string().required('Meta Title is required'),
    description: Yup.string().required('Description is required'),
    metaDescription: Yup.string().required('Meta Description is required'),
    tags: Yup.array().of(Yup.string()).required('Tags are required')
  }),
  gaId: Yup.string().required('GA Id is required'),
  gtmId: Yup.string().required('GTM Id is required'),
  shippingFee: Yup.number().required('GTM Id is required'),
  commission: Yup.string().required('GTM Id is required')
});

const homeSettingsSchema = Yup.object().shape({
  slides: Yup.array()
    .of(
      Yup.object().shape({
        link: Yup.string().required('Slide Link is required'),
        image: Yup.object()
          .shape({
            _id: Yup.string().required(),
            url: Yup.string().required()
          })
          .required('Slide image is required')
      })
    )
    .min(1, 'At least one slide is required'),
  banner1: Yup.object().shape({
    link: Yup.string().required('Banner 1 Link is required'),
    image: Yup.object()
      .shape({
        _id: Yup.string().required(),
        url: Yup.string().required()
      })
      .required('Banner 1 image is required')
  }),
  banner2: Yup.object().shape({
    link: Yup.string().required('Banner 2 Link is required'),
    image: Yup.object()
      .shape({
        _id: Yup.string().required(),
        url: Yup.string().required()
      })
      .required('Banner 2 image is required')
  }),
  banner3: Yup.object().shape({
    link: Yup.string().required('Banner 3 Link is required'),
    image: Yup.object()
      .shape({
        _id: Yup.string().required(),
        url: Yup.string().required()
      })
      .required('Banner 3 image is required')
  })
});

const generalSettingsSchema = Yup.object().shape({
  paypal: Yup.object().shape({
    isActive: Yup.boolean(),
    mode: Yup.string().when('isActive', {
      is: true,
      then: (schema) => schema.required('Mode is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    clientId: Yup.string().when('isActive', {
      is: true,
      then: (schema) => schema.required('Client ID is required'),
      otherwise: (schema) => schema.notRequired()
    })
  }),

  stripe: Yup.object().shape({
    isActive: Yup.boolean(),
    mode: Yup.string().when('isActive', {
      is: true,
      then: (schema) => schema.required('Mode is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    publishableKey: Yup.string().when('isActive', {
      is: true,
      then: (schema) => schema.required('Publishable Key is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    secretKey: Yup.string().when('isActive', {
      is: true,
      then: (schema) => schema.required('Secret Key is required'),
      otherwise: (schema) => schema.notRequired()
    })
  }),

  razorpay: Yup.object().shape({
    isActive: Yup.boolean(),
    mode: Yup.string().when('isActive', {
      is: true,
      then: (schema) => schema.required('Mode is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    keyId: Yup.string().when('isActive', {
      is: true,
      then: (schema) => schema.required('Key ID is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    keySecret: Yup.string().when('isActive', {
      is: true,
      then: (schema) => schema.required('Key Secret is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    webhookSecret: Yup.string().when('isActive', {
      is: true,
      then: (schema) => schema.required('Webhook Secret is required'),
      otherwise: (schema) => schema.notRequired()
    })
  }),

  cloudinary: Yup.object().shape({
    cloudName: Yup.string().required('Cloud Name is required'),
    apiKey: Yup.string().required('API Key is required'),
    apiSecret: Yup.string().required('API Secret is required'),
    preset: Yup.string().required('Upload Preset is required')
  }),

  smtp: Yup.object().shape({
    isActive: Yup.boolean(),
    host: Yup.string().when('isActive', {
      is: true,
      then: (schema) => schema.required('Host is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    port: Yup.number().when('isActive', {
      is: true,
      then: (schema) => schema.required('Port is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    user: Yup.string().when('isActive', {
      is: true,
      then: (schema) => schema.required('User is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    password: Yup.string().when('isActive', {
      is: true,
      then: (schema) => schema.required('Password is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    fromEmail: Yup.string().when('isActive', {
      is: true,
      then: (schema) => schema.email('Invalid email').required('From Email is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    secure: Yup.boolean()
  })
});

const brandingSettingsSchema = Yup.object().shape({
  theme: Yup.object().shape({
    palette: Yup.object().shape({
      primary: Yup.string().required('Primary color is required'),
      secondary: Yup.string().required('Secondary color is required'),
      defaultDark: Yup.string().required('Default Dark color is required'),
      defaultLight: Yup.string().required('Default Light color is required'),
      paperDark: Yup.string().required('Paper Dark color is required'),
      paperLight: Yup.string().required('Paper Light color is required')
    })
  }),
  logoDark: Yup.object().shape({
    _id: Yup.string().required('Id is required'),
    url: Yup.string().required('Dark logo URL is required')
  }),
  logoLight: Yup.object().shape({
    _id: Yup.string().required('Id is required'),
    url: Yup.string().required('Light logo URL is required')
  }),
  favicon: Yup.object().shape({
    _id: Yup.string().required('favicon _id is required'),
    url: Yup.string().required('favicon URL is required')
  }),
  contact: Yup.object().shape({
    address: Yup.string().required('Address is required'),
    addressOnMap: Yup.string().required('Address on Map is required'),
    lat: Yup.string().required('Latitude is required'),
    long: Yup.string().required('Longitude is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    whatsappNo: Yup.string().required('Whatsapp Number is required')
  }),
  socialLinks: Yup.object().shape({
    facebook: Yup.string().required('Facebook link is required'),
    twitter: Yup.string().required('Twitter link is required'),
    linkedin: Yup.string().required('LinkedIn link is required'),
    instagram: Yup.string().required('Instagram link is required')
  })
});

const changePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required'),
  newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match')
});

const shopSettingsSchema = (isVendor) =>
  Yup.object().shape({
    slug: Yup.string().required('Slug is required'),
    logo: Yup.object().required('Logo is required'),

    name: Yup.string().required('Shop name is required'),
    metaTitle: Yup.string().max(100, 'Meta title cannot exceed 100 characters').required('Meta title is required'),
    description: Yup.string().max(500, 'Description cannot exceed 500 characters').required('Description is required'),
    metaDescription: Yup.string()
      .max(200, 'Meta description cannot exceed 200 characters')
      .required('Meta description is required'),
    registrationNumber: Yup.string().required('Registration number is required'),
    address: Yup.object().shape({
      country: Yup.string().required('Country is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      streetAddress: Yup.string().required('Street address is required')
    }),
    contactPerson: Yup.string(),
    shopEmail: Yup.string().email('Invalid email').required('Shop email is required'),
    shopPhone: Yup.string()
      .required('Phone is required')
      .test('is-valid-phone', 'Shop Phone number is not valid', (value) => isValidPhoneNumber(value || '')),
    website: Yup.string().url('Invalid URL'),

    taxIdentificationNumber: Yup.string().required('Tax identification number is required'),
    vatRegistrationNumber: Yup.string(),
    identityVerification: Yup.object().shape({
      governmentId: Yup.object().shape({ url: Yup.string().url('Invalid URL').required('Image url is required') }),
      proofOfAddress: Yup.object().shape({ url: Yup.string().url('Invalid URL').required('Image url is required') })
    }),
    operationalDetails: Yup.object().shape({ returnPolicy: Yup.string(), handlingTime: Yup.string() }),
    ...(isVendor && {
      financialDetails: Yup.object().shape({
        paymentMethod: Yup.string().oneOf(['paypal', 'bank']).required('Payment method is required'),
        paypal: Yup.object().shape({
          email: Yup.string().when('paymentMethod', {
            is: 'paypal',
            then: (schema) => schema.email('Invalid email').required('PayPal email is required'),
            otherwise: (schema) => schema.notRequired()
          })
        }),
        bank: Yup.object().shape({
          accountNumber: Yup.string().when('paymentMethod', {
            is: 'bank',
            then: (schema) => schema.required('Account number is required'),
            otherwise: (schema) => schema.notRequired()
          }),
          bankName: Yup.string().when('paymentMethod', {
            is: 'bank',
            then: (schema) => schema.required('Bank name is required'),
            otherwise: (schema) => schema.notRequired()
          }),
          holderName: Yup.string().when('paymentMethod', {
            is: 'bank',
            then: (schema) => schema.required('Account holder name is required'),
            otherwise: (schema) => schema.notRequired()
          }),
          holderEmail: Yup.string()
            .email('Invalid email')
            .when('paymentMethod', {
              is: 'bank',
              then: (schema) => schema.required('Holder email is required'),
              otherwise: (schema) => schema.notRequired()
            }),
          address: Yup.string(),
          routingNumber: Yup.string(),
          swiftCode: Yup.string()
        })
      })
    })
  });

const attributeSchema = Yup.object().shape({
  name: Yup.string().required('Attribute name is required'),
  values: Yup.array().of(Yup.string().trim().required('Value is required')).min(1, 'At least one value is required')
});

const brandSchema = Yup.object().shape({
  name: Yup.string().required('Brand name is required'),
  logo: Yup.mixed().required('Logo is required'),
  slug: Yup.string().required('Slug is required'),
  description: Yup.string().required('Description is required'),
  metaTitle: Yup.string().required('Meta title is required'),
  metaDescription: Yup.string().required('Meta description is required')
});

const categorySchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  cover: Yup.mixed().required('Cover is required'),
  slug: Yup.string().required('Slug is required'),
  description: Yup.string().required('Description is required'),
  metaTitle: Yup.string().required('Meta title is required'),
  metaDescription: Yup.string().required('Meta description is required')
});

const subCategorySchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  cover: Yup.mixed().required('Cover is required'),
  slug: Yup.string().required('Slug is required'),
  description: Yup.string().required('Description is required'),
  metaTitle: Yup.string().required('Meta title is required'),
  metaDescription: Yup.string().required('Meta description is required'),
  parentCategory: Yup.string().required('Category is required')
});

const childCategorySchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  cover: Yup.mixed().required('Cover is required'),
  slug: Yup.string().required('Slug is required'),
  description: Yup.string().required('Description is required'),
  metaTitle: Yup.string().required('Meta title is required'),
  metaDescription: Yup.string().required('Meta description is required'),
  parentCategory: Yup.string().required('Category is required')
});

const contactUsSchema = Yup.object().shape({
  email: Yup.string().email('Email is required').required('Email is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.number().required('Phone number is required'),
  message: Yup.string().required('Message is required')
});

const couponCodeSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  code: Yup.string()
    .required('Cover is required')
    .matches(/^(\S+$)/g, 'Space is not allowed'),
  discount: Yup.number().required('Discount is required'),
  expire: Yup.date().when('eventStartDate', (eventStartDate, schema) =>
    schema.min(new Date(), "Expiry date can't be past date.")
  )
});

const currencySchema = Yup.object().shape({ rate: Yup.number() });

const forgetPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Enter valid email').required('Email is required')
});

const profileSchema = Yup.object().shape({
  firstName: Yup.string().required('First name required'),
  lastName: Yup.string().required('Last name required'),
  phone: Yup.string()
    .required('Phone Number is required')
    .test('is-valid-phone', 'Phone number is not valid', (value) => isValidPhoneNumber(value || '')),
  gender: Yup.string().required('Gender required'),
  gotra: Yup.string(),
  veda: Yup.string(),
  pankti: Yup.string(),
  shakha: Yup.string(),
  language: Yup.array().of(Yup.string())
});

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string().min(8, 'Short password').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Password is not matched')
});

const reviewSchema = Yup.object().shape({
  rating: Yup.mixed().required('Rating is required'),
  review: Yup.string().required('Review is required')
});

const signInSchema = Yup.object().shape({
  email: Yup.string().email('Enter valid email').required('Email is required.'),
  password: Yup.string().required('Password is required.').min(8, 'Password should be 8 characters or longer.')
});

const signUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'Too long!')
    .required('First name is required'),
  lastName: Yup.string().trim().min(1, 'Last name is required').max(50, 'Too long!').required('Last name is required'),
  email: Yup.string().email('Enter valid email').required('Email is required'),
  phone: Yup.string()
    .required('Phone is required')
    .test('is-valid-phone', 'Phone number is not valid', (value) => isValidPhoneNumber(value || '')),
  password: Yup.string().required('Password is required').min(8, 'Password should be 8 characters or longer.')
});

const checkoutSchema = (checked) =>
  Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phone: Yup.string()
      .required('Phone is required')
      .test('is-valid-phone', 'Phone number is not valid', (value) => isValidPhoneNumber(value || '')),
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    zip: Yup.string().required('Postal code is required'),
    shippingAddress: checked
      ? Yup.object().shape({
          firstName: Yup.string().required('First name is required'),
          lastName: Yup.string().required('Last name is required'),

          email: Yup.string().email('Enter a valid email').required('Email is required'),
          address: Yup.string().required('Address is required'),
          city: Yup.string().required('City is required'),
          state: Yup.string().required('State is required'),
          country: Yup.string().required('Country is required'),
          zip: Yup.string().required('Postal code is required')
        })
      : Yup.mixed().nullable()
  });

const editPaymentSchema = Yup.object().shape({
  total: Yup.string().required('Total is required'),
  totalIncome: Yup.string().required('Total Income is required'),
  totalCommission: Yup.string().required('Total Commission is required'),
  status: Yup.string().required('Status is required'),
  paidAt: Yup.date().when('eventStartDate', (eventStartDate, schema) => schema.min(new Date(), 'Date is required'))
});

const accountDeletionSchema = Yup.object().shape({
  email: Yup.string().email('Enter valid email').required('Email is required')
});

export {
  productSchema,
  mainSettingsSchema,
  homeSettingsSchema,
  generalSettingsSchema,
  brandingSettingsSchema,
  changePasswordSchema,
  shopSettingsSchema,
  attributeSchema,
  brandSchema,
  categorySchema,
  subCategorySchema,
  childCategorySchema,
  contactUsSchema,
  couponCodeSchema,
  currencySchema,
  forgetPasswordSchema,
  profileSchema,
  resetPasswordSchema,
  reviewSchema,
  signInSchema,
  signUpSchema,
  checkoutSchema,
  editPaymentSchema,
  accountDeletionSchema
};
