import { useEffect } from 'react';
import { showToast } from '../utils';
import { useError, useTheme } from '../context';

export const useErrorToast = () => {
  const { errorState, clearError } = useError();
  const { theme } = useTheme();

  useEffect(() => {
    if (errorState.error && errorState.error.displayType === 'toast') {
      showToast(errorState.error.message, 'error', theme);
      clearError();
    }
  }, [errorState.error, clearError, theme]);
};
