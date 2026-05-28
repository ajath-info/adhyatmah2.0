import React from 'react';
import PropTypes from 'prop-types';
// components
import ChildCategoryForm from '@/components/forms/child-category';

EditCategory.propTypes = {
  data: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function EditCategory({ data, categories, isLoading }) {
  return <ChildCategoryForm data={data} categories={categories} isLoading={isLoading} />;
}
