import React from 'react';
import { Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from '../components';
import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';
import { ErrorProvider } from './ErrorProvider';
import { PlayQueueProvider } from './PlayQueueProvider';

export const ProviderWrapper: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <HelmetProvider>
      <ErrorProvider>
        <ThemeProvider>
          <PlayQueueProvider>
            <AuthProvider>
              <Layout>{children || <Outlet />}</Layout>
            </AuthProvider>
          </PlayQueueProvider>
        </ThemeProvider>
      </ErrorProvider>
    </HelmetProvider>
  );
};

export default ProviderWrapper;
