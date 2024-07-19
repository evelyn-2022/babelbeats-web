import { ErrorState, CustomError } from '../types';

export const initialErrorState: ErrorState = {
  error: null,
};

type ErrorAction =
  | { type: 'ADD_ERROR'; payload: CustomError }
  | { type: 'CLEAR_ERROR' };

export const errorReducer = (
  state: ErrorState,
  action: ErrorAction
): ErrorState => {
  switch (action.type) {
    case 'ADD_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};
