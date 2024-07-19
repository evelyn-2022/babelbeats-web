import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { AuthContextType, User } from '../types';
import {
  getTokens,
  storeTokens,
  isTokenExpired,
  extractUserInfo,
} from '../utils';
import { refreshTokens } from '../services';
import { authReducer, initialAuthState } from '../reducers';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, dispatch] = useReducer(
    authReducer,
    initialAuthState,
    () => {
      const storedState = sessionStorage.getItem('authState');
      return storedState ? JSON.parse(storedState) : initialAuthState;
    }
  );

  const authRequest = () => {
    dispatch({ type: 'AUTH_REQUEST' });
  };

  const authSuccess = (user: User) => {
    const newState = { ...initialAuthState, user, isAuthenticated: true };
    dispatch({ type: 'AUTH_SUCCESS', payload: user });
    sessionStorage.setItem('authState', JSON.stringify(newState));
  };

  const authFailure = () => {
    dispatch({ type: 'AUTH_FAILURE' });
    sessionStorage.removeItem('authState');
  };

  const setLoadingFalse = () => {
    dispatch({ type: 'AUTH_FAILURE' });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    sessionStorage.removeItem('authState');
  };

  const checkUserSignInState = useCallback(async () => {
    try {
      dispatch({ type: 'AUTH_REQUEST' });
      let userInfo;

      const { idToken, accessToken, refreshToken } = getTokens();

      if (!idToken || !accessToken || !refreshToken) {
        dispatch({ type: 'AUTH_FAILURE' });
        return;
      }

      if (
        isTokenExpired(idToken) ||
        (isTokenExpired(accessToken) && refreshToken)
      ) {
        const newTokens = await refreshTokens(refreshToken);
        if (!newTokens) {
          throw new Error('Failed to refresh tokens');
        }

        await storeTokens(
          newTokens.idToken,
          newTokens.accessToken,
          refreshToken
        );
        userInfo = await extractUserInfo(newTokens.idToken);
      } else {
        userInfo = await extractUserInfo(idToken);
      }
      authSuccess(userInfo);
    } catch (error) {
      authFailure();
    }
  }, [dispatch]);

  useEffect(() => {
    checkUserSignInState();
  }, [checkUserSignInState]);

  return (
    <AuthContext.Provider
      value={{
        authState,
        dispatch,
        authRequest,
        authSuccess,
        authFailure,
        setLoadingFalse,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
