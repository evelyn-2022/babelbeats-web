import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { wave } from '../assets';
import { useAuth } from '../context';
import { VerificationCodeForm } from '../components';

const VerifyPasswordResetPage: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  const handleVerificationSubmit = (code: string) => {
    navigate('/reset-password', { state: { code } });
  };

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center gap-8'>
      <Helmet>
        <title>BabelBeats | Verify Password Reset</title>
      </Helmet>
      <div className='flex flex-row items-center gap-1.5'>
        <div className='rounded-full bg-primary p-1'>
          <img src={wave} className='w-6 h-6' alt='Wave' />
        </div>
        <div className='font-sans font-bold'>BabelBeats</div>
      </div>
      <div className='flex flex-col items-center justify-center gap-2'>
        <h1 className='text-4xl font-bold'>Reset your password</h1>
        <p className='text-sm  text-customBlack-light/70 dark:text-customWhite/70'>
          Enter the verification code in your mailbox
        </p>
      </div>

      <VerificationCodeForm
        onCodeSubmit={handleVerificationSubmit}
        isLoading={authState.loading}
        buttonText='Next'
      />
    </div>
  );
};

export default VerifyPasswordResetPage;
