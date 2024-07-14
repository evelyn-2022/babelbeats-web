import Cookies from 'js-cookie';
import { User } from '../types';

export const storeTokens = (
  idToken: string,
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean
) => {
  if (rememberMe) {
    return Promise.all([
      Cookies.set('idToken', idToken),
      Cookies.set('accessToken', accessToken),
      Cookies.set('refreshToken', refreshToken),
    ]);
  } else {
    return Promise.all([
      sessionStorage.setItem('idToken', idToken),
      sessionStorage.setItem('accessToken', accessToken),
    ]);
  }
};

export const getTokens = () => {
  return {
    idToken: Cookies.get('idToken') || sessionStorage.getItem('idToken'),
    accessToken:
      Cookies.get('accessToken') || sessionStorage.getItem('accessToken'),
    refreshToken:
      Cookies.get('refreshToken') || sessionStorage.getItem('refreshToken'),
  };
};

export const removeTokens = () => {
  Cookies.remove('idToken');
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');

  sessionStorage.removeItem('idToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
};

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = parseJwt(token);
  if (!decoded) {
    return true;
  }
  const exp = decoded.exp;
  const currentTime = Math.floor(Date.now() / 1000);
  return exp < currentTime;
};

export const extractUserInfo = async (idToken: string): Promise<User> => {
  try {
    const decoded = parseJwt(idToken);
    return {
      id: decoded?.['custom:id'] || '',
      cognitoSub: decoded?.sub || '',
      name: decoded?.name || '',
      email: decoded?.email || '',
      profilePic: decoded?.['custom:profilePic'] || '',
      providerId: decoded?.['cognito:username'] || '',
    };
  } catch (error) {
    throw new Error('Invalid token or failed to parse JWT');
  }
};
