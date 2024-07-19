import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { wave } from '../assets';
import { useTheme, useError } from '../context';
import { useAuthService } from '../hooks';
import { showToast } from '../utils';

const OAuthCallbackPage: React.FC = () => {
  const { theme } = useTheme();
  const { addError } = useError();
  const { handleGoogleSignInCallback } = useAuthService();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      return;
    }
    hasRun.current = true;

    const handleSignIn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authorizationCode = urlParams.get('code');

      if (!authorizationCode) {
        showToast('No authorization code found', 'error', theme);
        return;
      }

      try {
        await handleGoogleSignInCallback(authorizationCode);
      } catch (error) {
        let errorMessage;
        if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = 'An unknown error occurred while signing in';
        }
        addError({
          message: errorMessage,
          displayType: 'toast',
          category: 'auth',
        });
      }
    };

    handleSignIn();
  }, [handleGoogleSignInCallback, addError, theme]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center w-full gap-8'>
      <Helmet>
        <title>BabelBeats | Authenticating</title>
      </Helmet>
      <div className='flex flex-row items-center gap-1.5'>
        <div className='rounded-full bg-primary p-1'>
          <img src={wave} className='w-6 h-6' alt='Wave' />
        </div>
        <div className='font-sans font-bold'>BabelBeats</div>
      </div>

      <div className='text-4xl'>Authenticating</div>
      <div className='loader mt-4'></div>
    </div>
  );
};

export default OAuthCallbackPage;
