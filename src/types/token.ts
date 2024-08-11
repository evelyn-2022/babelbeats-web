export type TokenType = 'CognitoToken' | 'SpotifyToken';

export interface TokenBase {
  accessToken: string;
}

export interface CognitoToken extends TokenBase {
  idToken: string;
  refreshToken: string;
}

export interface ConnectionToken extends TokenBase {
  refreshToken: string;
}

export type Token = CognitoToken | ConnectionToken;
