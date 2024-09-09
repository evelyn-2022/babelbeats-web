import axios, { AxiosError } from 'axios';
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
  getLyricsFromDBApi,
  postLyricsToDBApi,
} from '../services';

export const useApiService = () => {
  const { addError } = useError();

  const handleApiError = (error: unknown, errorConfig?: CustomError): null => {
    let customError: CustomError = {
      message: errorConfig?.message || 'An unexpected error occurred',
      displayType: errorConfig?.displayType || 'toast',
      category: errorConfig?.category || 'general',
    };

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorMessage = axiosError?.message;

      switch (axiosError.response?.status) {
        case 400:
          customError = {
            message: errorConfig?.message || errorMessage || 'Bad request.',
            displayType: errorConfig?.displayType || 'toast',
            category: 'validation',
          };
          break;
        case 401:
          customError = {
            message:
              errorConfig?.message || errorMessage || 'Unauthorized access.',
            displayType: errorConfig?.displayType || 'toast',
            category: 'auth',
          };
          break;
        case 403:
          customError = {
            message:
              errorConfig?.message ||
              errorMessage ||
              'Forbidden access. You do not have permission.',
            displayType: errorConfig?.displayType || 'toast',
            category: 'auth',
          };
          break;
        case 404:
          customError = {
            message:
              errorConfig?.message || errorMessage || 'Resource not found.',
            displayType: errorConfig?.displayType || 'toast',
            category: 'general',
          };
          break;
        case 500:
          customError = {
            message:
              errorConfig?.message ||
              errorMessage ||
              'Internal server error. Please try again later.',
            displayType: errorConfig?.displayType || 'toast',
            category: 'server',
          };
          break;
        default:
          customError = {
            message:
              errorConfig?.message ||
              errorMessage ||
              'An error occurred. Please try again.',
            displayType: errorConfig?.displayType || 'toast',
            category: 'general',
          };
          break;
      }
    } else {
      customError = {
        message:
          errorConfig?.message ||
          'A network error occurred. Please check your connection.',
        displayType: errorConfig?.displayType || 'toast',
        category: 'network',
      };
    }

    addError(customError);
    return null;
  };

  const callApi = async <T>(
    apiCall: () => Promise<T>,
    errorConfig?: CustomError
  ): Promise<T | null> => {
    try {
      return await apiCall();
    } catch (error) {
      return handleApiError(error, errorConfig);
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
    return callApi(() => searchGeniusSongsApi(songTitle, artistName), {
      message:
        'An unexpected error happened during searching. Please try again later.',
      displayType: 'inline',
      category: 'general',
    });
  };

  const searchGeniusLyrics = async (id: number) => {
    return callApi(() => searchGeniusLyricsApi(id));
  };

  const getLyricsFromDB = async (id: string) => {
    return callApi(() => getLyricsFromDBApi(id), {
      message: 'Cannot get lyrics from database',
      displayType: 'none',
      category: 'general',
    });
  };

  const postLyricsToDB = async (ytbId: string, lyrics: string) => {
    return callApi(() => postLyricsToDBApi(ytbId, lyrics), {
      message: 'Cannot post lyrics to database. Please try again later.',
      displayType: 'toast',
      category: 'general',
    });
  };

  return {
    checkRegistration,
    updateUserId,
    partialUpdateDBUser,
    deleteDBUser,
    getDBUserById,
    searchGeniusSongs,
    searchGeniusLyrics,
    getLyricsFromDB,
    postLyricsToDB,
  };
};
