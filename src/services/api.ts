import axios from 'axios';
import config from '../config';
import { withAsyncErrorHandling } from '../utils';
import { User } from '../types';

const API_URL = config.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

export const createUser = withAsyncErrorHandling(
  async (name: string, email: string): Promise<User> => {
    const response = await apiClient.post('appusers', { name, email });
    return response.data;
  }
);
