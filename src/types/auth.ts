export interface User {
  id: string;
  cognitoSub: string;
  name: string;
  email: string;
  profilePic: string | null;
  providerId: string;
  spotifyAccessToken?: string | null;
  spotifyRefreshToken?: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface AuthAction {
  type: 'AUTH_REQUEST' | 'AUTH_SUCCESS' | 'AUTH_FAILURE' | 'LOGOUT';
  payload?: User;
}

export interface AuthContextType {
  authState: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  authRequest: () => void;
  authSuccess: (user: User) => void;
  authFailure: () => void;
  setLoadingFalse: () => void;
  logout: () => void;
}

export interface ValidatedFields {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  songTitle?: string;
  artist?: string;
  album?: string;
  year?: string;
}
