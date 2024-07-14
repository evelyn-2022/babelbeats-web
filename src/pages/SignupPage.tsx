import React, { useState } from 'react';
import { wave } from '../assets';
import { Button, InputField, SocialSignInGroup } from '../components';
import { useAuth } from '../context';
import { useAuthService } from '../hooks';

const SignupPage: React.FC = () => {
  const { authState, changeAuthState } = useAuth();
  const { handleSignUp } = useAuthService();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSignUp(email, password, username);
  };

  const fields = [
    {
      label: 'Username',
      type: 'username',
      value: username,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        changeAuthState({ error: null });
      },
    },
    {
      label: 'Email',
      type: 'email',
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        changeAuthState({ error: null });
      },
    },
    {
      label: 'Password',
      type: 'password',
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        changeAuthState({ error: null });
      },
    },
  ];

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center gap-8'>
      <div className='flex flex-row items-center gap-1.5'>
        <div className='rounded-full bg-primary p-1'>
          <img src={wave} className='h-6' alt='Wave' />
        </div>
        <div className='font-sans font-bold'>BabelBeats</div>
      </div>
      <div className='flex flex-col items-center justify-center gap-2'>
        <h1 className='text-6xl font-bold'>Welcome!</h1>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {fields.map(field => (
          <InputField
            key={field.label.toLowerCase().replace(' ', '-')}
            id={field.label.toLowerCase().replace(' ', '-')}
            label={field.label}
            type={field.type}
            value={field.value}
            onChange={field.onChange}
          />
        ))}
        <div className='flex flex-col items-center justify-between relative'>
          <Button width='w-96' type='submit' variant='filled'>
            {authState.loading ? (
              <>
                <div className='w-4 h-4 border-2 border-white border-solid border-t-transparent rounded-full animate-spin mr-2'></div>
                Processing...
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
          {authState.error?.message && (
            <p className='absolute top-14 text-red-500'>
              {authState.error.message}
            </p>
          )}
        </div>
      </form>

      <SocialSignInGroup text='sign up' />

      <a href='/login'>
        Already a member? <span className='link'>Login</span>
      </a>
    </div>
  );
};

export default SignupPage;
