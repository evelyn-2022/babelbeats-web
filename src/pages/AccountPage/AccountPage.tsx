import { useState, useEffect, useRef } from 'react';
import { useAuth, useError, useTheme } from '../../context';
import {
  Modal,
  Button,
  InputField,
  VerificationCodeForm,
} from '../../components';
import {
  updateCognitoUserEmail,
  verifyNewEmail,
  checkEmailRegistered,
} from '../../services';
import { validateField, getTokens, showToast } from '../../utils';
import { User } from '../../types';

const AccountPage: React.FC = () => {
  const { authState, authSuccess } = useAuth();
  const { theme } = useTheme();
  const { errorState, addError, clearError } = useError();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSecondModalOpen, setSecondModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFirstModalClose = () => {
    setModalOpen(false);
    setSecondModalOpen(false);
  };

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
      setModalOpen(false);
      return;
    }

    try {
      await updateCognitoUserEmail(authState.user?.cognitoSub, newEmail);
      setModalOpen(false);
      setSecondModalOpen(true);
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
      setSecondModalOpen(false);
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

  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  return (
    <div className='flex flex-col gap-14 p-6'>
      {!authState.user?.providerId.startsWith('google') && (
        <div>
          <h2 className='font-bold text-xl'>Account Security</h2>
          <div className='border-b border-white/20 my-4'></div>
          <div className='flex flex-col gap-8'>
            <div className='flex flex-row justify-between'>
              <div>
                <div className='font-semibold'>Email</div>
                <div className='text-gray-500'>{authState.user?.email}</div>
              </div>
              <Button
                width='w-40'
                variant='outlined'
                onClick={() => setModalOpen(true)}
              >
                Change email
              </Button>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleFirstModalClose}>
              <div className='flex flex-col gap-8'>
                <div className='text-center text-xl font-bold'>
                  Enter New Email
                </div>
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
                />
                <Button onClick={handleEmailChange} variant='filled'>
                  Continue
                </Button>
              </div>
            </Modal>

            <Modal isOpen={isSecondModalOpen} onClose={handleFirstModalClose}>
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

            <div className='flex flex-row items-center justify-between'>
              <div>
                <div className='font-semibold'>Password</div>
                <div className='text-gray-500'>
                  Use the password to log into your account
                </div>
              </div>
              <Button width='w-40' variant='outlined'>
                Change password
              </Button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className='font-bold text-xl'>Support</h2>
        <div className='border-b border-white/20 my-4'></div>
        <div className='text-red-500'>Delete my account</div>
      </div>
    </div>
  );
};

export default AccountPage;
