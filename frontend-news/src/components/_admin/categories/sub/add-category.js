import React from 'react';
import PropTypes from 'prop-types';
// components
import SubCategoryForm from '@/components/forms/sub-category';

AddCategory.propTypes = {
  categories: PropTypes.array.isRequired
};

export default function AddCategory({ categories }) {
  return (
    <div>
      <SubCategoryForm categories={categories} />
    </div>
  );
}
