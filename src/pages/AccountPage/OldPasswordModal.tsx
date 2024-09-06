import React, { useState, useRef, useEffect } from 'react';
import { Modal, InputField, Button } from '../../components';
import { useError, useAuth } from '../../context';
import { verifyOldPassword } from '../../services';

interface OldPasswordModalProps {
  isOldPasswordModalOpen: boolean;
  setOldPasswordModalOpen: (isOpen: boolean) => void;
  setNewPasswordModalOpen: (isOpen: boolean) => void;
  handleOldPasswordModalClose: () => void;
  oldPassword: string;
  setOldPassword: (email: string) => void;
}

const OldPasswordModal: React.FC<OldPasswordModalProps> = ({
  isOldPasswordModalOpen,
  setOldPasswordModalOpen,
  setNewPasswordModalOpen,
  handleOldPasswordModalClose,
  oldPassword,
  setOldPassword,
}) => {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { addError, clearError } = useError();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOldPasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsLoading(true);
    if (!authState.user?.email) {
      addError({
        message: 'Cannot find authorized user',
        displayType: 'toast',
        category: 'auth',
      });
      setIsLoading(false);
      return;
    }

    const email = authState.user.email;
    try {
      await verifyOldPassword(email, oldPassword);
      setOldPasswordModalOpen(false);
      setNewPasswordModalOpen(true);
    } catch (error) {
      console.log(email, oldPassword);
      console.error(error);
      addError({
        message: 'Incorrect password',
        displayType: 'toast',
        category: 'auth',
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isOldPasswordModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOldPasswordModalOpen]);

  return (
    <Modal
      isOpen={isOldPasswordModalOpen}
      onClose={handleOldPasswordModalClose}
    >
      <form className='flex flex-col gap-8' onSubmit={handleOldPasswordSubmit}>
        <div className='text-center text-xl font-bold'>
          Enter Your Current Password
        </div>
        <InputField
          id='password'
          type='password'
          value={oldPassword}
          onChange={e => {
            setOldPassword(e.target.value);
            clearError();
          }}
          width='w-full'
          ref={inputRef}
        />
        <Button variant='filled' type='submit' width='w-full'>
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
export default OldPasswordModal;
