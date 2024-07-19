import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { useErrorToast } from '../../hooks';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useErrorToast();

  return (
    <div>
      <ToastContainer />
      {children}
    </div>
  );
};

export default Layout;
