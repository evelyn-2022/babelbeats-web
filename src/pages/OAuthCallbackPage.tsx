import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { wave } from '../assets';
import { useAuthService } from '../hooks';

const OAuthCallbackPage: React.FC = () => {
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

      if (authorizationCode) {
        try {
          await handleGoogleSignInCallback(authorizationCode);
        } catch (error) {
          console.error('Failed to sign in:', error);
        }
      } else {
        console.error('Authorization code not found in URL');
      }
    };

    handleSignIn();
  }, [handleGoogleSignInCallback]);

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
