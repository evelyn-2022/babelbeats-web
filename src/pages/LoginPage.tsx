import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { wave } from '../assets';
import {
  Button,
  InputField,
  SocialSignInGroup,
  ToggleSwitch,
} from '../components';
import { useAuth, useTheme } from '../context';
import { useAuthService } from '../hooks';

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const { authState, changeAuthState } = useAuth();
  const { handleSignIn } = useAuthService();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignIn(email, password);
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
        <h1 className='text-4xl font-bold'>Welcome back!</h1>
      </div>

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

      <ToastContainer />
    </div>
  );
};

export default LoginPage;
