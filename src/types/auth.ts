export interface User {
  id: string;
  cognitoSub: string;
  name: string;
  email: string;
  profilePic: string | null;
  providerId: string;
}

export interface Token {
  id_token: string;
  access_token: string;
  refresh_token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
