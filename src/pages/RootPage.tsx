import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context';
import { ProductLandingPage } from '../pages';
import { getTokens } from '../utils';
import { useAuthService } from '../hooks';

const RootPage: React.FC = () => {
  const { authState } = useAuth();
  const { scheduleTokenRefresh } = useAuthService();

  useEffect(() => {
    const tokens = getTokens('CognitoToken');
    const accessToken = tokens?.accessToken;
    const refreshToken = tokens?.refreshToken;

    if (accessToken && refreshToken) {
      scheduleTokenRefresh(accessToken, refreshToken);
    }
  }, []);

  return authState.isAuthenticated ? <Outlet /> : <ProductLandingPage />;
};

export default RootPage;
