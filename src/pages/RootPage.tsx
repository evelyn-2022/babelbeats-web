import React from 'react';
import { useAuth } from '../context';
import { ProductLandingPage } from '../pages';
import { Outlet } from 'react-router-dom';

const RootPage: React.FC = () => {
  const { authState } = useAuth();

  return authState.isAuthenticated ? <Outlet /> : <ProductLandingPage />;
};

export default RootPage;
