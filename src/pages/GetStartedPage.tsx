import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, SocialSignInGroup, Logo } from '../components';

const GetStartedPage: React.FC = () => {
  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center gap-8'>
      <Helmet>
        <title>BabelBeats | Get Started</title>
      </Helmet>
      <Logo />

      <div className='flex flex-col gap-2 text-xl md:text-3xl font-bold items-center'>
        <div>Your Music, Any Language</div>
        <div>All in One App</div>
      </div>

      <div className='flex flex-col gap-2'>
        <a href='/signup'>
          <Button variant='filled'>Sign up</Button>
        </a>
      </div>

      <SocialSignInGroup text='continue' />

      <a href='/login'>
        Already a member? <span className='link'>Log in</span>
      </a>
    </div>
  );
};

export default GetStartedPage;
