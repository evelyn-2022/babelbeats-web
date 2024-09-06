import React, { useState, useRef, useEffect } from 'react';
import { Modal, InputField, Button } from '../../components';
import { useError, useAuth, useTheme } from '../../context';
import { showToast, validateField } from '../../utils';
import { checkEmailRegistered, updateCognitoUserEmail } from '../../services';
import { CustomError } from '../../types';

interface NewEmailModalProps {
  isNewEmailModalOpen: boolean;
  setNewEmailModalOpen: (isOpen: boolean) => void;
  setVerificationModalOpen: (isOpen: boolean) => void;
  handleNewEmailModalClose: () => void;
  newEmail: string;
  setNewEmail: (email: string) => void;
}

const NewEmailModal: React.FC<NewEmailModalProps> = ({
  isNewEmailModalOpen,
  setNewEmailModalOpen,
  setVerificationModalOpen,
  handleNewEmailModalClose,
  newEmail,
  setNewEmail,
}) => {
  const { authState } = useAuth();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { errorState, addError, clearError } = useError();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputErrorSetter, setInputErrorSetter] = useState<React.Dispatch<
    React.SetStateAction<CustomError | null>
  > | null>(null);

  const handleSetStateFromChild = (
    setter: React.Dispatch<React.SetStateAction<CustomError | null>>
  ) => {
    setInputErrorSetter(() => setter); // Store the setter function
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    if (!inputErrorSetter) return;
    const isValidEmail = validateField({
      id: 'email',
      values: { email: newEmail },
      addError,
      clearError,
      setError: inputErrorSetter,
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
      showToast(
        'Please check your inbox for verification code',
        'success',
        theme
      );
    } catch (error) {
      addError({
        message: 'An error occurred while updating email',
        displayType: 'toast',
        category: 'auth',
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isNewEmailModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isNewEmailModalOpen]);

  return (
    <Modal isOpen={isNewEmailModalOpen} onClose={handleNewEmailModalClose}>
      <form className='flex flex-col gap-8' onSubmit={handleEmailSubmit}>
        <div className='text-center text-xl font-bold'>Enter New Email</div>
        <InputField
          id='email'
          type='text'
          value={newEmail}
          values={{ email: newEmail }}
          onChange={e => {
            setNewEmail(e.target.value);
            clearError();
          }}
          requireValidation={true}
          width='w-30'
          ref={inputRef}
          passSetStateToParent={handleSetStateFromChild}
        />
        <Button variant='filled' type='submit'>
          {isLoading ? (
            <>
              <div className='w-4 h-4 border-2 border-white border-solid border-t-transparent rounded-full animate-spin mr-2'></div>
              Processing...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </form>
    </Modal>
  );
};
export default NewEmailModal;
