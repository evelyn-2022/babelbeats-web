import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { wave } from '../assets';
import {
  Button,
  InputField,
  SocialSignInGroup,
  ToggleSwitch,
} from '../components';
import { useAuth, useError } from '../context';
import { useAuthService } from '../hooks';

const LoginPage: React.FC = () => {
  const { authState } = useAuth();
  const { handleSignIn } = useAuthService();
  const { clearError } = useError();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignIn(email, password, rememberMe);
    setIsSubmitDisabled(true);
    setTimeout(() => {
      setIsSubmitDisabled(false);
    }, 5000);
  };

  const toggleRememberMe = () => {
    setRememberMe(prevState => !prevState);
  };

  const fields = [
    {
      label: 'Email',
      type: 'text',
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        clearError();
      },
    },
    {
      label: 'Password',
      type: 'password',
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        clearError();
      },
    },
  ];

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center gap-8'>
      <Helmet>
        <title>BabelBeats | Log In</title>
      </Helmet>
      <div className='flex flex-row items-center gap-1.5'>
        <div className='rounded-full bg-primary p-1'>
          <img src={wave} className='w-6 h-6' alt='Wave' />
        </div>
        <div className='font-sans font-bold text-lg'>BabelBeats</div>
      </div>
      <h1 className='text-4xl font-bold'>Welcome back!</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        {fields.map(field => (
          <InputField
            key={field.label.toLowerCase()}
            id={field.label.toLowerCase()}
            label={field.label}
            type={field.type}
            value={field.value}
            onChange={field.onChange}
          />
        ))}

        <div className='flex flex-row itmes-center justify-between text-sm  -mt-2'>
          <ToggleSwitch checked={rememberMe} onChange={toggleRememberMe} />
          <Link to='/forgot-password' className='link'>
            Forgot password?
          </Link>
        </div>

        <div className='flex flex-col items-center'>
          <Button
            width='w-96'
            type='submit'
            variant='filled'
            disabled={isSubmitDisabled}
          >
            {authState.loading ? (
              <>
                <div className='w-4 h-4 border-2 border-white border-solid border-t-transparent rounded-full animate-spin mr-2'></div>
                Processing...
              </>
            ) : (
              'Log In'
            )}
          </Button>
        </div>
      </form>

      <SocialSignInGroup text='log in' />
      <a href='/signup'>
        Not a member? <span className='link'>Sign up</span>
      </a>
    </div>
  );
};

export default LoginPage;
