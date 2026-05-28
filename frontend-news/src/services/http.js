import axios from 'axios';
import { store } from '@/redux'; // if using redux
import { setLogout } from '@/redux/slices/user';
import toast from 'react-hot-toast';

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

const apiRoot = process.env.NEXT_PUBLIC_API_URL;
const http = axios.create({
  baseURL: apiRoot ? apiRoot + `/api` : undefined
  // withCredentials: true
});

http.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: catch 401
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ✅ show toast once
      toast.error('Session expired, please login again.');

      // ✅ clear auth state
      store.dispatch(setLogout());
      // ✅ optional: redirect to login page
      window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  }
);

export default http;
