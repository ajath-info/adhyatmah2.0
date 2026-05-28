import React from 'react';
import PropTypes from 'prop-types';
// components
import ChildCategoryForm from '@/components/forms/child-category';

AddCategory.propTypes = {
  categories: PropTypes.array.isRequired
};

export default function AddCategory({ categories }) {
  return (
    <div>
      <ChildCategoryForm categories={categories} />
    </div>
  );
}
