function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_PAGE = '/';

export const PATH_PAGE = {
  root: ROOTS_PAGE,
  auth: {
    signIn: path(ROOTS_PAGE, 'auth/sign-in'),
    signUp: path(ROOTS_PAGE, 'auth/sign-up'),
    forgetPassword: path(ROOTS_PAGE, 'auth/forget-password'),
    resetPassword: path(ROOTS_PAGE, 'auth/reset-password')
  },
  general: {
    userProfile: path(ROOTS_PAGE, 'profile')
  }
};
