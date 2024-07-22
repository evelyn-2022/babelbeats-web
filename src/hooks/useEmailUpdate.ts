import { useAuth, useError, useTheme } from '../context';
import {
  updateCognitoUserEmail,
  verifyNewEmail,
  checkEmailRegistered,
} from '../services';
import { validateField, getTokens, showToast } from '../utils';
import { User } from '../types';

interface UseEmailUpdateProps {
  setIsLoading: (isLoading: boolean) => void;
  newEmail: string;
  setNewEmailModalOpen: (isOpen: boolean) => void;
  setVerificationModalOpen: (isOpen: boolean) => void;
}

interface UseEmailUpdateReturn {
  handleEmailChange: () => Promise<void>;
  handleConfirm: (code: string) => Promise<void>;
}

export const useEmailUpdate = ({
  setIsLoading,
  newEmail,
  setNewEmailModalOpen,
  setVerificationModalOpen,
}: UseEmailUpdateProps): UseEmailUpdateReturn => {
  const { authState, authSuccess } = useAuth();
  const { theme } = useTheme();
  const { errorState, addError, clearError } = useError();

  const handleEmailChange = async () => {
    setIsLoading(true);
    if (!authState.user?.cognitoSub) {
      addError({
        message: 'Cannot find authorized user',
        displayType: 'toast',
        category: 'auth',
      });
      setIsLoading(false);
      return;
    }

    // Check if new email is the same as current email
    if (newEmail.trim() === authState.user?.email) {
      addError({
        message: 'New email cannot be the same as the current email',
        displayType: 'toast',
        category: 'auth',
      });
      setIsLoading(false);
      return;
    }

    // Check if email is valid
    const isValidEmail = validateField({
      id: 'email',
      values: { email: newEmail },
      addError,
      clearError,
    });
    if (!isValidEmail || errorState.error) {
      setIsLoading(false);
      return;
    }

    // Check if email already registered
    try {
      const isEmailRegistered = await checkEmailRegistered(newEmail);
      if (isEmailRegistered) {
        addError({
          message: 'Email is already registered',
          displayType: 'toast',
          category: 'auth',
        });
        setIsLoading(false);
        return;
      }
    } catch (error) {
      addError({
        message: 'An error occurred while checking email',
        displayType: 'toast',
        category: 'auth',
      });
      setIsLoading(false);
      setNewEmailModalOpen(false);
      return;
    }

    try {
      await updateCognitoUserEmail(authState.user?.cognitoSub, newEmail);
      setNewEmailModalOpen(false);
      setVerificationModalOpen(true);
    } catch (error) {
      addError({
        message: 'An error occurred while updating email',
        displayType: 'toast',
        category: 'auth',
      });
    }
    setIsLoading(false);
  };

  const handleConfirm = async (code: string) => {
    setIsLoading(true);
    const accessToken = getTokens().accessToken;
    if (!accessToken) return;

    try {
      await verifyNewEmail(accessToken, code);
      setVerificationModalOpen(false);
      authSuccess({ ...authState.user, email: newEmail } as User);
      showToast('Email updated successfully', 'success', theme);
    } catch (error) {
      addError({
        message: 'An error occurred while verifying email',
        displayType: 'toast',
        category: 'auth',
      });
    }
    setIsLoading(false);
  };

  return {
    handleEmailChange,
    handleConfirm,
  };
};
