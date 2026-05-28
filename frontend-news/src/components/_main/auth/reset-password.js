import React from 'react';
import PropTypes from 'prop-types';
// components
import ResetPasswordForm from '@/components/forms/reset-password';

const ResetPasswordMain = ({ token }) => {
  return <ResetPasswordForm token={token} />;
};

ResetPasswordMain.propTypes = {
  token: PropTypes.string.isRequired
};

export default ResetPasswordMain;
