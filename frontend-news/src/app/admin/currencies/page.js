import React from 'react';

// Components
import CurrencyList from '@/components/_admin/currencies/currency-list';

// Meta information
export const metadata = {
  title: 'Currencies - adhyatmah',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah'
};
export default function Currencies() {
  return <CurrencyList />;
}
