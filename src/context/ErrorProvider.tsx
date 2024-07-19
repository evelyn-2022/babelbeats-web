import React, { createContext, useReducer, ReactNode } from 'react';
import { CustomError, ErrorContextType } from '../types';
import { errorReducer, initialErrorState } from '../reducers';

export const ErrorContext = createContext<ErrorContextType | undefined>(
  undefined
);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [errorState, dispatch] = useReducer(errorReducer, initialErrorState);

  const addError = (error: CustomError) => {
    dispatch({ type: 'ADD_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <ErrorContext.Provider value={{ errorState, addError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};
