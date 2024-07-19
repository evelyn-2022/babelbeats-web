import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

export const showToast = (
  message: string,
  type: 'success' | 'error',
  theme: 'light' | 'dark'
) => {
  toast(message, {
    type,
    position: 'top-center',
    theme,
    closeOnClick: true,
    draggable: true,
  });
};

export const Toast: React.FC = () => {
  return <ToastContainer />;
};
