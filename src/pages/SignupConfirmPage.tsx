import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import { wave } from '../assets';
import { useAuth, useTheme } from '../context';
import { VerificationCodeForm } from '../components';
import { resendConfirmationCode } from '../services';
import { useAuthService } from '../hooks';
import { showToast } from '../utils';

const SignupConfirmPage: React.FC = () => {
  const { authState, changeAuthState } = useAuth();
  const { theme } = useTheme();
  const { handleConfirmSignUp } = useAuthService();

  const handleVerificationSubmit = (code: string) => {
    handleConfirmSignUp(code);
  };

  const handleResendConfirmationCode = async () => {
    const email = sessionStorage.getItem('emailForConfirmation');
    if (!email) {
      changeAuthState({
        loading: false,
        error: {
          message: 'Email not found',
        } as Error,
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
      const errorMessage = (error as Error).message;
      changeAuthState({ error: error as Error });
      showToast(errorMessage, 'error', theme);
      changeAuthState({ error: null });
    }
  };

  useEffect(() => {
    if (authState.error?.message) {
      showToast(authState.error.message, 'error', theme);
      changeAuthState({ error: null });
    }
  }, [authState.error]);

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

      <ToastContainer />
    </div>
  );
};

export default SignupConfirmPage;
