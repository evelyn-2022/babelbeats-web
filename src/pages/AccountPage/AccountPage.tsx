import { useState } from 'react';
import { useAuth } from '../../context';
import { Button } from '../../components';
import NewEmailModal from './NewEmailModal';
import VerificationModal from './VerificationModal';

const AccountPage: React.FC = () => {
  const { authState } = useAuth();
  const [isNewEmailModalOpen, setNewEmailModalOpen] = useState(false);
  const [isVerificationModalOpen, setVerificationModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const handleNewEmailModalClose = () => {
    setNewEmailModalOpen(false);
    setVerificationModalOpen(false);
  };

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
                onClick={() => setNewEmailModalOpen(true)}
              >
                Change email
              </Button>
            </div>

            <NewEmailModal
              isNewEmailModalOpen={isNewEmailModalOpen}
              setNewEmailModalOpen={setNewEmailModalOpen}
              setVerificationModalOpen={setVerificationModalOpen}
              handleNewEmailModalClose={handleNewEmailModalClose}
              newEmail={newEmail}
              setNewEmail={setNewEmail}
            />

            <VerificationModal
              setVerificationModalOpen={setVerificationModalOpen}
              newEmail={newEmail}
              isVerificationModalOpen={isVerificationModalOpen}
              handleNewEmailModalClose={handleNewEmailModalClose}
            />

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
