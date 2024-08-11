import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { wave } from '../assets';
import { useTheme, useError, useAuth } from '../context';
import { useAuthService, useSpotifyService } from '../hooks';

import { showToast } from '../utils';

interface OAuthCallbackPageProps {
  provider: 'google' | 'spotify';
}

const OAuthCallbackPage: React.FC<OAuthCallbackPageProps> = ({ provider }) => {
  const { theme } = useTheme();
  const { addError } = useError();
  const { authState } = useAuth();
  const { handleGoogleSignInCallback } = useAuthService();
  const { handleSpotifySigninCallback } = useSpotifyService();
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
        if (provider === 'google') {
          await handleGoogleSignInCallback(authorizationCode);
        } else if (provider === 'spotify') {
          const id = authState.user?.id;
          if (!id) return;
          await handleSpotifySigninCallback(authorizationCode, parseInt(id));
        }
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
  }, [
    handleGoogleSignInCallback,
    handleSpotifySigninCallback,
    addError,
    provider,
    theme,
  ]);

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
