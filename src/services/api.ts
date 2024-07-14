import axios, { AxiosResponse } from 'axios';
import config from '../config';
import { withAsyncErrorHandling } from '../utils';
import { User } from '../types';
import { updateCognitoUserIdAttribute } from './authService';

const API_URL = config.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

export const checkRegistration = withAsyncErrorHandling(
  async (providerId: string): Promise<User | null> => {
    const response = await apiClient.get(`appusers/by-provider/${providerId}`);
    return response.data;
  }
);

export const updateUser = withAsyncErrorHandling(
  async (user: User): Promise<User> => {
    let updatedUser: User;
    let res: User | null = null;

    if (user.providerId?.startsWith('google')) {
      res = await checkRegistration(user.providerId);
    }

    if (res) {
      updatedUser = res;
    } else {
      const response: AxiosResponse<User> = await apiClient.post(
        'appusers',
        user
      );
      updatedUser = response.data;
    }

    console.log('updated:', updatedUser);

    await updateCognitoUserIdAttribute(user.cognitoSub, updatedUser.id);
    return updatedUser;
  }
);
