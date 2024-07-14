import React from 'react';
import { wave } from '../assets';
import { useAuth } from '../context';
import { resendConfirmationCode } from '../services';
import { VerificationCodeForm } from '../components';
import { useAuthService } from '../hooks';

const SignupConfirmPage: React.FC = () => {
  const { authState } = useAuth();
  const { handleConfirmSignUp } = useAuthService();

  const handleVerificationSubmit = (code: string) => {
    handleConfirmSignUp(code);
  };

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center gap-8'>
      <div className='flex flex-row items-center gap-1.5'>
        <div className='rounded-full bg-primary p-1'>
          <img src={wave} className='w-6 h-6' alt='Wave' />
        </div>
        <div className='font-sans font-bold'>BabelBeats</div>
      </div>
      <div className='flex flex-col items-center justify-center gap-2'>
        <h1 className='text-4xl font-bold'>You are almost there!</h1>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          Please enter the verification code in your mailbox
        </p>
      </div>

      <VerificationCodeForm
        onCodeSubmit={handleVerificationSubmit}
        isLoading={authState.loading}
        buttonText='Confirm'
      />

      <div>
        Didn't receive it?{' '}
        <button className='link' onClick={resendConfirmationCode}>
          Send a new code
        </button>
      </div>
    </div>
  );
};

export default SignupConfirmPage;
