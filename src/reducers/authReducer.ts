import { AuthState, AuthAction } from '../types';

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

export const authReducer = (
  state: AuthState = initialAuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case 'AUTH_REQUEST':
      return { ...state, loading: true };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload || null,
        isAuthenticated: true,
        loading: false,
      };
    case 'AUTH_FAILURE':
      return { ...state, isAuthenticated: false, loading: false, user: null };
    case 'LOGOUT':
      return initialAuthState;
    default:
      return state;
  }
};
