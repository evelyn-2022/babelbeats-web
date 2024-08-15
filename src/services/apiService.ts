import axios, { AxiosResponse } from 'axios';
import config from '../config';
import { CognitoToken, ConnectionToken, User } from '../types';
import { updateCognitoUserIdAttribute } from './authService';
import { getTokens } from '../utils';

const API_URL = config.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

const createAuthConfig = () => {
  const { accessToken } = getTokens('CognitoToken') as CognitoToken;
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const checkRegistrationApi = async (
  providerId: string
): Promise<User | null> => {
  const response = await apiClient.get(`appusers/by-provider/${providerId}`);
  return response.data;
};

export const updateUserIdApi = async (user: User): Promise<User> => {
  let updatedUser: User;
  let res: User | null = null;

  // If registered with Google, check if user exists in the database
  if (user.providerId?.startsWith('google')) {
    try {
      res = await checkRegistrationApi(user.providerId);
    } catch (error) {
      // If user is not found, continue with registration
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        res = null;
      } else {
        // If an unexpected error occurs, throw it
        throw error;
      }
    }
  }

  if (res) {
    updatedUser = res;
  } else {
    const response: AxiosResponse<User> = await apiClient.post(
      'appusers',
      user,
      createAuthConfig()
    );
    updatedUser = response.data;
  }

  await updateCognitoUserIdAttribute(user.cognitoSub, updatedUser.id);
  return updatedUser;
};

export const partialUpdateDBUserApi = async (
  userId: string,
  updates: Partial<User>
): Promise<void> => {
  await apiClient.patch(`appusers/${userId}`, updates, createAuthConfig());
};

export const deleteDBUserApi = async (userId: string): Promise<void> => {
  await apiClient.delete(`appusers/${userId}`, createAuthConfig());
};

export const getDBUserByIdApi = async (userId: string): Promise<User> => {
  const response = await apiClient.get(`appusers/${userId}`);
  return response.data;
};

export const spotifySigninCallbackApi = async (
  code: string,
  userId: number
): Promise<ConnectionToken> => {
  const res = await apiClient.get(`spotify/callback?code=${code}&id=${userId}`);

  return {
    accessToken: res.data.access_token,
    refreshToken: res.data.refresh_token,
  };
};

export const refreshSpotifyAccessTokenApi = async (
  id: string,
  refreshToken: string
): Promise<string> => {
  const response = await axios.post(
    `${API_URL}spotify/refresh-token?id=${id}`,
    {
      refreshToken,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.access_token;
};