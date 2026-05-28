'use client';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'src/redux';
import { useRouter } from '@bprogress/next';
import { signIn, setInitialize } from 'src/redux/slices/user';
import { getProfile } from 'src/services';

// components
import Loading from 'src/components/loading';

// JWT decode function
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

// Get token from cookies
function getToken() {
  const cname = 'token';
  if (typeof window !== 'undefined') {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
  return '';
}

export default function AuthGuard({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized } = useSelector(({ user }) => user);
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      // Check if there's a token in cookies
      const token = getToken();
      if (token) {
        const decodedToken = decodeJWT(token);
        if (decodedToken && decodedToken._id) {
          // Token is valid, fetch complete user profile
          getProfile()
            .then((response) => {
              // Handle different response formats
              const userData = response?.payload?.user || response?.data || response;
              if (userData) {
                dispatch(signIn({
                  _id: userData.id || userData._id,
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  email: userData.email,
                  cover: userData.profileImage || userData.cover,
                  role: userData.role,
                  phone: userData.phone,
                  gender: userData.gender,
                  address: userData.address,
                  city: userData.city,
                  country: userData.country,
                  zip: userData.zip,
                  state: userData.state,
                  about: userData.about
                }));
              } else {
                // Fallback to basic data if profile fetch fails
                dispatch(signIn({
                  _id: decodedToken._id,
                  email: decodedToken.email
                }));
              }
            })
            .catch((error) => {
              console.error('Failed to fetch user profile:', error);
              // Fallback to basic data if profile fetch fails
              dispatch(signIn({
                _id: decodedToken._id,
                email: decodedToken.email
              }));
            });
        }
      }
      dispatch(setInitialize());
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated) {
        setAuth(false);
        router.push('/auth/sign-in');
      } else {
        setAuth(true);
      }
    }
  }, [isAuthenticated, isInitialized, router]);

  // Show loading while checking authentication
  if (!isInitialized) {
    return <Loading />;
  }

  // Show loading while redirecting
  if (!isAuth) {
    return <Loading />;
  }

  return children;
}

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired
};
