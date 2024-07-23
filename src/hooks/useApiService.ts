import axios from 'axios';
import { useError } from '../context';
import { CustomError, User } from '../types';
import {
  checkRegistrationApi,
  updateUserIdApi,
  deleteDBUserApi,
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

  const updateUser = async (user: User): Promise<User | null> => {
    return callApi(() => updateUserIdApi(user));
  };

  const deleteDBUser = async (userId: string): Promise<void | null> => {
    return callApi(() => deleteDBUserApi(userId));
  };

  return { checkRegistration, updateUser, deleteDBUser };
};
