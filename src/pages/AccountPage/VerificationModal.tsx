import { useState } from 'react';
import { Modal, VerificationCodeForm } from '../../components';
import { getTokens, showToast } from '../../utils';
import { verifyNewEmail } from '../../services';
import { useAuth, useTheme, useError } from '../../context';
import { User } from '../../types';

interface VerificationModalProps {
  setVerificationModalOpen: (isOpen: boolean) => void;
  newEmail: string;
  isVerificationModalOpen: boolean;
  handleNewEmailModalClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  setVerificationModalOpen,
  newEmail,
  isVerificationModalOpen,
  handleNewEmailModalClose,
}) => {
  const { authState, authSuccess } = useAuth();
  const { theme } = useTheme();
  const { addError } = useError();
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <Modal isOpen={isVerificationModalOpen} onClose={handleNewEmailModalClose}>
      <div className='flex flex-col gap-8'>
        <div className='text-center text-xl font-bold'>
          Enter Verification Code
        </div>
        <VerificationCodeForm
          buttonText='Confirm'
          onCodeSubmit={handleConfirm}
          spacing='space-x-2'
          btnWidth='w-full'
          isLoading={isLoading}
        />
      </div>
    </Modal>
  );
};
export default VerificationModal;
