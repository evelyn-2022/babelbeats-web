import { useState } from 'react';
import { useAuth } from '../../context';
import { Button } from '../../components';
import NewEmailModal from './NewEmailModal';
import VerificationModal from './VerificationModal';
import OldPasswordModal from './OldPasswordModal';
import NewPasswordModal from './NewPasswordModal';
import DeleteAccountModal from './DeleteAccountModal';
import { spotifySignin } from '../../services';
import { FaSpotify } from 'react-icons/fa';

const AccountPage: React.FC = () => {
  const { authState } = useAuth();
  const [isNewEmailModalOpen, setNewEmailModalOpen] = useState(false);
  const [isVerificationModalOpen, setVerificationModalOpen] = useState(false);
  const [isOldPasswordModalOpen, setOldPasswordModalOpen] = useState(false);
  const [isNewPasswordModalOpen, setNewPasswordModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleNewEmailModalClose = () => {
    setNewEmailModalOpen(false);
    setVerificationModalOpen(false);
    setNewEmail('');
  };

  const handleOldPasswordModalClose = () => {
    setOldPasswordModalOpen(false);
    setNewPasswordModalOpen(false);
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className='flex flex-col gap-16 px-6 py-1.5 lg:py-2.5 lg:max-w-[860px] mx-auto'>
      {!authState.user?.providerId.startsWith('google') && (
        <section>
          <h2 className='font-bold text-xl'>Account Security</h2>
          <div className='border-b border-white/20 my-4' />
          <div className='flex flex-col gap-8'>
            <div className='flex flex-row justify-between'>
              <div>
                <div className='font-semibold'>Email</div>
                <div className='text-customBlack/50 dark:text-white/60'>
                  {authState.user?.email}
                </div>
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

            <OldPasswordModal
              isOldPasswordModalOpen={isOldPasswordModalOpen}
              setOldPasswordModalOpen={setOldPasswordModalOpen}
              setNewPasswordModalOpen={setNewPasswordModalOpen}
              handleOldPasswordModalClose={handleOldPasswordModalClose}
              oldPassword={oldPassword}
              setOldPassword={setOldPassword}
            />

            <NewPasswordModal
              isNewPasswordModalOpen={isNewPasswordModalOpen}
              handleOldPasswordModalClose={handleOldPasswordModalClose}
              newPassword={newPassword}
              oldPassword={oldPassword}
              setNewPassword={setNewPassword}
            />

            <div className='flex flex-row items-center justify-between'>
              <div>
                <div className='font-semibold'>Password</div>
                <div className='text-customBlack/50 dark:text-white/60'>
                  Use the password to log into your account
                </div>
              </div>
              <Button
                width='w-40'
                variant='outlined'
                onClick={() => setOldPasswordModalOpen(true)}
              >
                Change password
              </Button>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className='font-bold text-xl'>Connections</h2>
        <div className='border-b border-white/20 my-4' />
        <div className='flex flex-row justify-between'>
          <div className='flex flex-row items-center gap-2'>
            <FaSpotify className='text-2xl text-green-500' />
            <div className='font-semibold'>Spotify</div>
          </div>

          <Button width='w-40' variant='outlined' onClick={spotifySignin}>
            Connect
          </Button>
        </div>
      </section>

      <section>
        <h2 className='font-bold text-xl'>Support</h2>
        <div className='border-b border-white/20 my-4' />
        <div
          className='text-red-500 cursor-pointer'
          onClick={() => {
            setDeleteAccountModalOpen(true);
          }}
        >
          Delete my account
        </div>
        <DeleteAccountModal
          isDeleteAccountModalOpen={isDeleteAccountModalOpen}
          setDeleteAccountModalOpen={setDeleteAccountModalOpen}
        />
      </section>
    </div>
  );
};

export default AccountPage;
