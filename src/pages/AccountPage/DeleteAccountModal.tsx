import React, { useState } from 'react';
import { Modal, Button } from '../../components';
import { deleteCognitoUser } from '../../services';
import { getTokens, showToast } from '../../utils';
import { useError, useTheme, useAuth } from '../../context';
import { useAuthService, useApiService } from '../../hooks';

interface DeleteAccountModalProps {
  isDeleteAccountModalOpen: boolean;
  setDeleteAccountModalOpen: (isOpen: boolean) => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isDeleteAccountModalOpen,
  setDeleteAccountModalOpen,
}) => {
  const { theme } = useTheme();
  const { addError } = useError();
  const { authState } = useAuth();
  const { handleSignOut } = useAuthService();
  const { deleteDBUser } = useApiService();
  const [isLoading, setIsLoading] = useState(false);

  const handleAccountDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const accessToken = getTokens().accessToken;
    const id = authState.user?.id;
    if (!accessToken || !id) {
      addError({
        message: 'Cannot find authorized user',
        displayType: 'toast',
        category: 'auth',
      });
      return;
    }

    try {
      await deleteDBUser(id);
      await deleteCognitoUser(accessToken);
      showToast('Account deleted successfully', 'success', theme);
    } catch (error) {
      addError({
        message: 'An error occurred while deleting account',
        displayType: 'toast',
        category: 'auth',
      });
    }
    setIsLoading(false);
    setDeleteAccountModalOpen(false);
    setTimeout(() => {
      handleSignOut();
    }, 3000);
  };

  return (
    <Modal
      isOpen={isDeleteAccountModalOpen}
      onClose={() => setDeleteAccountModalOpen(false)}
    >
      <form className='flex flex-col gap-6' onSubmit={handleAccountDelete}>
        <div className='text-center text-xl font-bold leading-8 w-full'>
          Are you sure you want to delete your account?
        </div>
        <div className='text-center text-red-500 mb-2'>
          Warning: this action cannot be undone!
        </div>
        <div className='flex flex-row justify-center gap-4'>
          <Button
            width='w-36'
            variant='outlined'
            onClick={() => setDeleteAccountModalOpen(false)}
          >
            Cancel
          </Button>
          <Button width='w-36' variant='danger' type='submit'>
            {isLoading ? (
              <>
                <div className='w-4 h-4 border-2 border-white border-solid border-t-transparent rounded-full animate-spin mr-2'></div>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DeleteAccountModal;
