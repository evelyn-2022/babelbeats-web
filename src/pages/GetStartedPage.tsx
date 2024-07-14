import React from 'react';
import wave from '../assets/images/wave.svg';
import { Button, SocialSignInGroup } from '../components';

const GetStartedPage: React.FC = () => {
  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center gap-8'>
      <div className='flex flex-row items-center gap-1.5'>
        <div className='rounded-full bg-primary p-1'>
          <img src={wave} className='w-6 h-6' alt='Wave' />
        </div>
        <div className='font-sans font-bold text-lg'>BabelBeats</div>
      </div>

      <div className='flex flex-col gap-2 text-3xl font-bold items-center'>
        <div>Your Music, Any Language</div>
        <div>All in One App</div>
      </div>

      <div className='flex flex-col gap-2'>
        <a href='/signup'>
          <Button variant='filled' width='w-96'>
            Sign up
          </Button>
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
