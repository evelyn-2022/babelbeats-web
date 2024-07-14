import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';

export const ProviderWrapper: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider>
      <AuthProvider>{children || <Outlet />}</AuthProvider>
    </ThemeProvider>
  );
};

export default ProviderWrapper;
