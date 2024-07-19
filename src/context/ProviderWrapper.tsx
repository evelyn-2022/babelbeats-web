import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from '../components';
import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';
import { ErrorProvider } from './ErrorProvider';
import { HelmetProvider } from 'react-helmet-async';

export const ProviderWrapper: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <HelmetProvider>
      <ErrorProvider>
        <ThemeProvider>
          <AuthProvider>
            <Layout>{children || <Outlet />}</Layout>
          </AuthProvider>
        </ThemeProvider>
      </ErrorProvider>
    </HelmetProvider>
  );
};

export default ProviderWrapper;
