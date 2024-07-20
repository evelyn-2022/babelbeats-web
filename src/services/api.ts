import axios, { AxiosResponse } from 'axios';
import config from '../config';
import { User } from '../types';
import { updateCognitoUserIdAttribute } from './authService';

const API_URL = config.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

export const checkRegistrationApi = async (
  providerId: string
): Promise<User | null> => {
  const response = await apiClient.get(`appusers/by-provider/${providerId}`);
  return response.data;
};

export const updateUserApi = async (user: User): Promise<User> => {
  let updatedUser: User;
  let res: User | null = null;

  // If registered with Google, check if user exists in the database
  if (user.providerId?.startsWith('google')) {
    res = await checkRegistrationApi(user.providerId);
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

  await updateCognitoUserIdAttribute(user.cognitoSub, updatedUser.id);
  return updatedUser;
};
