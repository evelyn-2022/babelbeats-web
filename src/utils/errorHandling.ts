import axios from 'axios';

export const withAsyncErrorHandling = <T>(
  asyncFunc: (...args: any[]) => Promise<T>
) => {
  return async (...args: any[]): Promise<T | null> => {
    try {
      return await asyncFunc(...args);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return null;
        } else if (error.response?.status === 404) {
          return null;
        }
      }
      console.error('An unexpected error occurred', error);
      return null;
    }
  };
};
