import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ToastContainer, toast } from 'react-toastify';
import { wave } from '../assets';
import { InputField, Button } from '../components';
import { forgotPassword } from '../services';
import { useAuth, useTheme } from '../context';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { authState, changeAuthState } = useAuth();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await forgotPassword(email);
      navigate('/verify-password-reset');
    } catch (error) {
      changeAuthState({ error: error as Error });
      console.error('Failed to send email:', error);
    }
  };

  useEffect(() => {
    if (authState.error?.message) {
      toast.error(authState.error.message, {
        position: 'top-center',
        theme: theme === 'dark' ? 'dark' : 'light',
        closeOnClick: true,
        draggable: true,
      });
      changeAuthState({ error: null });
    }
  }, [authState.error]);

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center gap-8'>
      <Helmet>
        <title>BabelBeats | Forgot Password</title>
      </Helmet>
      <div className='flex flex-row items-center gap-1.5'>
        <div className='rounded-full bg-primary p-1'>
          <img src={wave} className='w-6 h-6' alt='Wave' />
        </div>
        <div className='font-sans font-bold text-lg'>BabelBeats</div>
      </div>
      <div className='flex flex-col items-center justify-center gap-4'>
        <h1 className='text-4xl font-bold'>Forgot your password?</h1>
        <p className='text-sm text-customBlack-light/70 dark:text-customWhite/70'>
          We'll send you a verification code to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
        <InputField
          key='email'
          id='email'
          label='Email'
          type='email'
          value={email}
          onChange={e => {
            setEmail(e.target.value);
          }}
        />

        <Button width='w-96' type='submit' variant='filled'>
          Send email
        </Button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordPage;
