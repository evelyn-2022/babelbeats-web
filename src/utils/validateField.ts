import validator from 'validator';
import { CustomError, ValidatedFields } from '../types';
import { checkEmailRegistered } from '../services';

interface ValidationParams {
  id: keyof ValidatedFields;
  values: ValidatedFields;
  addError: (error: CustomError) => void;
  clearError: () => void;
  setError: (error: CustomError | null) => void;
}

export const validateField = async ({
  id,
  values,
  addError,
  clearError,
  setError,
}: ValidationParams): Promise<boolean> => {
  clearError();
  setError(null);

  const value = values[id];

  switch (id) {
    case 'email': {
      let error: CustomError | null = null;
      if (!validator.isEmail(value as string)) {
        error = {
          message: 'Invalid email address.',
          displayType: 'inline',
          category: 'validation',
        };
        setError(error);
        return false;
      } else {
        const isRegistered = await checkEmailRegistered(value as string);

        if (isRegistered) {
          error = {
            message: 'Email already registered. Please log in.',
            displayType: 'inline',
            category: 'validation',
          };
          setError(error);
          addError(error);
          return false;
        } else {
          return true;
        }
      }
    }
    case 'password': {
      const criteria = [
        (value as string).length >= 8,
        /\d/.test(value as string),
        /[a-z]/.test(value as string),
      ];
      if (!criteria.every(Boolean)) {
        const error: CustomError = {
          message: 'Password does not meet criteria.',
          displayType: 'inline',
          category: 'validation',
        };
        setError(error);
        addError(error);
        return false;
      }
      break;
    }
    case 'passwordConfirm': {
      const { password, passwordConfirm } = values;

      if (password !== passwordConfirm) {
        const error: CustomError = {
          message: 'Passwords do not match.',
          displayType: 'inline',
          category: 'validation',
        };
        setError(error);
        addError(error);
        return false;
      }
      break;
    }
    case 'name':
    case 'songTitle':
    case 'artist': {
      let error: CustomError | null = null;
      const message =
        id === 'name' ? 'Username' : id === 'artist' ? 'Artist' : 'Song title';
      if ((value as string).trim() === '') {
        error = {
          message: message + ' cannot be empty.',
          displayType: 'inline',
          category: 'validation',
        };
      } else if (id === 'name' && (value as string).length > 15) {
        error = {
          message: message + ' must not exceed 15 characters.',
          displayType: 'inline',
          category: 'validation',
        };
      } else if (
        (id === 'artist' || id === 'songTitle') &&
        (value as string).length > 50
      ) {
        error = {
          message: message + ' must not exceed 50 characters.',
          displayType: 'inline',
          category: 'validation',
        };
      }
      if (error) {
        addError(error);
        setError(error);
        return false;
      }
      break;
    }
    default:
      setError(null);
  }
  return true;
};
