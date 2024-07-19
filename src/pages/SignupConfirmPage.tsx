import React from 'react';
import { Helmet } from 'react-helmet-async';
import { wave } from '../assets';
import { useAuth, useTheme, useError } from '../context';
import { VerificationCodeForm } from '../components';
import { resendConfirmationCode } from '../services';
import { useAuthService } from '../hooks';
import { showToast } from '../utils';

const SignupConfirmPage: React.FC = () => {
  const { authState, setLoadingFalse } = useAuth();
  const { addError } = useError();
  const { theme } = useTheme();
  const { handleConfirmSignUp } = useAuthService();

  const handleVerificationSubmit = (code: string) => {
    handleConfirmSignUp(code);
  };

  const handleResendConfirmationCode = async () => {
    const email = sessionStorage.getItem('emailForConfirmation');
    if (!email) {
      setLoadingFalse();
      addError({
        message: 'Email for confirmation not found',
        displayType: 'toast',
        category: 'auth',
      });
      return;
    }

    try {
      await resendConfirmationCode(email);
      showToast(
        'We have sent you a new verification code. Please check your inbox',
        'success',
        theme
      );
    } catch (error) {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An error occurred while resending the code';
      }
      addError({
        message: errorMessage,
        displayType: 'toast',
        category: 'auth',
      });
    }
  };

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center gap-8'>
      <Helmet>
        <title>BabelBeats | Confirm Sign Up</title>
      </Helmet>
      <div className='flex flex-row items-center gap-1.5'>
        <div className='rounded-full bg-primary p-1'>
          <img src={wave} className='w-6 h-6' alt='Wave' />
        </div>
        <div className='font-sans font-bold'>BabelBeats</div>
      </div>
      <div className='flex flex-col items-center justify-center gap-2'>
        <h1 className='text-4xl font-bold'>You are almost there!</h1>
        <p className='text-sm text-customBlack-light/70 dark:text-customWhite/70'>
          Enter the verification code in your mailbox
        </p>
      </div>

      <VerificationCodeForm
        onCodeSubmit={handleVerificationSubmit}
        isLoading={authState.loading}
        buttonText='Confirm'
      />

      <div>
        Didn't receive it?{' '}
        <button className='link' onClick={handleResendConfirmationCode}>
          Send a new code
        </button>
      </div>
    </div>
  );
};

export default SignupConfirmPage;
