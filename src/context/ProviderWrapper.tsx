import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { HelmetProvider } from 'react-helmet-async';

export const ProviderWrapper: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>{children || <Outlet />}</AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default ProviderWrapper;
