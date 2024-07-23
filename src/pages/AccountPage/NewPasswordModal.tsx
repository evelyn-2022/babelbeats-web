import React, { useState, useRef, useEffect } from 'react';
import { Modal, InputField, Button } from '../../components';
import { useError, useAuth, useTheme } from '../../context';
import { showToast, validateField, getTokens } from '../../utils';
import { changePassword } from '../../services';

interface NewPasswordModalProps {
  isNewPasswordModalOpen: boolean;
  handleOldPasswordModalClose: () => void;
  newPassword: string;
  oldPassword: string;
  setNewPassword: (password: string) => void;
}

const NewPasswordModal: React.FC<NewPasswordModalProps> = ({
  isNewPasswordModalOpen,
  handleOldPasswordModalClose,
  newPassword,
  oldPassword,
  setNewPassword,
}) => {
  const { authState } = useAuth();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const { errorState, addError, clearError } = useError();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleNewPasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if password is valid
    const isValidPassword = validateField({
      id: 'password',
      values: { password: newPassword },
      addError,
      clearError,
    });
    if (!isValidPassword || errorState.error) {
      setIsLoading(false);
      return;
    }

    // Check if user is authorized
    if (!authState.user?.email) {
      addError({
        message: 'Cannot find authorized user',
        displayType: 'toast',
        category: 'auth',
      });
      setIsLoading(false);
      return;
    }
    const accessToken = getTokens().accessToken;
    if (!accessToken) return;

    try {
      await changePassword(oldPassword, newPassword, accessToken);
      showToast('Password updated successfully', 'success', theme);
      handleOldPasswordModalClose();
    } catch (error) {
      addError({
        message: 'An error occurred while updating password',
        displayType: 'toast',
        category: 'auth',
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isNewPasswordModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isNewPasswordModalOpen]);

  return (
    <Modal
      isOpen={isNewPasswordModalOpen}
      onClose={handleOldPasswordModalClose}
    >
      <form className='flex flex-col gap-8' onSubmit={handleNewPasswordSubmit}>
        <div className='text-center text-xl font-bold'>Enter New Password</div>
        <InputField
          id='password'
          type='password'
          value={newPassword}
          values={{ password: newPassword }}
          onChange={e => {
            setNewPassword(e.target.value);
            clearError();
          }}
          requireValidation={true}
          width='w-30'
          ref={inputRef}
        />
        <Button variant='filled' type='submit'>
          {isLoading ? (
            <>
              <div className='w-4 h-4 border-2 border-white border-solid border-t-transparent rounded-full animate-spin mr-2'></div>
              Confirming...
            </>
          ) : (
            'Confirm'
          )}
        </Button>
      </form>
    </Modal>
  );
};
export default NewPasswordModal;
