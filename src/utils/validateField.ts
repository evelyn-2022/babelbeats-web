import validator from 'validator';
import { CustomError, ValidatedFields } from '../types';

interface ValidationParams {
  id: keyof ValidatedFields;
  values: ValidatedFields;
  addError: (error: CustomError) => void;
  clearError: () => void;
}

export const validateField = ({
  id,
  values,
  addError,
  clearError,
}: ValidationParams): boolean => {
  clearError();
  const value = values[id];

  switch (id) {
    case 'email': {
      if (!validator.isEmail(value as string)) {
        addError({
          message: 'Invalid email address.',
          displayType: 'inline',
          category: 'validation',
        });
        return false;
      }
      break;
    }
    case 'password': {
      const criteria = [
        (value as string).length >= 8,
        /\d/.test(value as string),
        /[a-z]/.test(value as string),
      ];
      if (!criteria.every(Boolean)) {
        addError({
          message: 'Password does not meet criteria.',
          displayType: 'inline',
          category: 'validation',
        });
        return false;
      }
      break;
    }
    case 'passwordConfirm': {
      const { password, passwordConfirm } = values;
      if (password !== passwordConfirm) {
        addError({
          message: 'Passwords do not match.',
          displayType: 'inline',
          category: 'validation',
        });
        return false;
      }
      break;
    }
    case 'name': {
      if ((value as string).trim() === '') {
        addError({
          message: 'Username cannot be empty.',
          displayType: 'inline',
          category: 'validation',
        });
        return false;
      }
      break;
    }
    default:
      clearError();
  }
  return true;
};
