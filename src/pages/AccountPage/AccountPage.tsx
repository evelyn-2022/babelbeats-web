import { useState, useEffect, useRef } from 'react';
import { useAuth, useError } from '../../context';
import {
  Modal,
  Button,
  InputField,
  VerificationCodeForm,
} from '../../components';
import { updateCognitoUserEmail } from '../../services';

const AccountPage: React.FC = () => {
  const { authState } = useAuth();
  const { clearError } = useError();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSecondModalOpen, setSecondModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [newEmail, setNewEmail] = useState('');

  const handleFirstModalClose = () => {
    setModalOpen(false);
    setSecondModalOpen(false);
  };

  const handleEmailChange = async () => {
    try {
      //   await updateCognitoUserEmail('username', newEmail);
      setModalOpen(false);
      setSecondModalOpen(true);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleConfirm = async () => {
    // Replace 'username' with actual username
    setSecondModalOpen(false);
    setNewEmail('');
  };

  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  return (
    <div className='flex flex-col gap-14 p-6'>
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
                type='text'
                value={newEmail}
                onChange={e => {
                  setNewEmail(e.target.value);
                  clearError();
                }}
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
              />
            </div>
          </Modal>

          {!authState.user?.providerId.startsWith('google') && (
            <div className='flex flex-row items-center justify-between'>
              <div>
                <div className='font-semibold'>Password</div>
                <div className='text-gray-500'>
                  Set a password to log into your account
                </div>
              </div>
              <Button width='w-40' variant='outlined'>
                Change password
              </Button>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className='font-bold text-xl'>Support</h2>
        <div className='border-b border-white/20 my-4'></div>
        <div className='text-red-500'>Delete my account</div>
      </div>
    </div>
  );
};

export default AccountPage;
