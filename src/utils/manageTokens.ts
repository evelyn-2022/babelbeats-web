import { User, Token, TokenType } from '../types';

export const storeTokens = <T extends Token>(
  tokenType: TokenType,
  token: T,
  rememberMe: boolean = true
): Promise<void> => {
  return new Promise<void>(resolve => {
    const tokenString = JSON.stringify(token);

    if (rememberMe) {
      localStorage.setItem(tokenType, tokenString);
    } else {
      sessionStorage.setItem(tokenType, tokenString);
    }

    resolve();
  });
};

export const getTokens = <T extends Token>(tokenType: TokenType): T | null => {
  const tokenString =
    localStorage.getItem(tokenType) || sessionStorage.getItem(tokenType);
  if (tokenString) {
    return JSON.parse(tokenString) as T;
  }

  return null;
};

export const removeTokens = (tokenType: TokenType) => {
  localStorage.removeItem(tokenType);
  sessionStorage.removeItem(tokenType);
};

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const getExpiryTime = (token: string): number => {
  const decoded = parseJwt(token);
  if (!decoded) {
    return 0;
  }
  return decoded.exp;
};

export const isTokenExpired = (token: string): boolean => {
  const exp = getExpiryTime(token);
  if (exp === 0) {
    return true;
  }
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
