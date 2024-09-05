import axios from 'axios';
import { useError } from '../context';
import { CustomError, User } from '../types';
import {
  checkRegistrationApi,
  updateUserIdApi,
  deleteDBUserApi,
  getDBUserByIdApi,
  partialUpdateDBUserApi,
  searchGeniusSongsApi,
  searchGeniusLyricsApi,
} from '../services';

export const useApiService = () => {
  const { addError } = useError();

  const handleApiError = (error: unknown): null => {
    let customError: CustomError = {
      message: 'An unexpected error occurred',
      displayType: 'toast',
      category: 'general',
    };

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        customError = {
          message: 'Unauthorized access',
          displayType: 'toast',
          category: 'auth',
        };
      } else if (error.response?.status === 404) {
        customError = {
          message: 'Resource not found',
          displayType: 'toast',
          category: 'auth',
        };
      }
    }

    addError(customError);
    return null;
  };

  const callApi = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
    try {
      return await apiCall();
    } catch (error) {
      return handleApiError(error);
    }
  };

  const checkRegistration = async (
    providerId: string
  ): Promise<User | null> => {
    return callApi(() => checkRegistrationApi(providerId));
  };

  const updateUserId = async (user: User): Promise<User | null> => {
    return callApi(() => updateUserIdApi(user));
  };

  const partialUpdateDBUser = async (
    userId: string,
    updates: Partial<User>
  ): Promise<void | null> => {
    return callApi(() => partialUpdateDBUserApi(userId, updates));
  };

  const deleteDBUser = async (userId: string): Promise<void | null> => {
    return callApi(() => deleteDBUserApi(userId));
  };

  const getDBUserById = async (userId: string): Promise<User | null> => {
    return callApi(() => getDBUserByIdApi(userId));
  };

  const searchGeniusSongs = async (songTitle: string, artistName: string) => {
    return callApi(() => searchGeniusSongsApi(songTitle, artistName));
  };

  const searchGeniusLyrics = async (id: number) => {
    return callApi(() => searchGeniusLyricsApi(id));
  };

  return {
    checkRegistration,
    updateUserId,
    partialUpdateDBUser,
    deleteDBUser,
    getDBUserById,
    searchGeniusSongs,
    searchGeniusLyrics,
  };
};
