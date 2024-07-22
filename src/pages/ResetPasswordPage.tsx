import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { wave } from '../assets';
import { InputField, Button } from '../components';
import { resetPassword } from '../services';
import { useError } from '../context';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { errorState, addError, clearError } = useError();
  const { code } = state || {};
  const [password, setPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (errorState.error || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await resetPassword(code, password);
      navigate('/login');
    } catch (error) {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An unknown error occurred while resetting the password';
      }
      addError({
        message: errorMessage,
        displayType: 'toast',
        category: 'auth',
      });
      setTimeout(() => {
        navigate('/verify-password-reset');
      }, 3000);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false); // Re-enable the submit button after a delay
      }, 3000);
    }
  };

  const validateField = () => {
    const criteria = [
      password.length >= 8,
      /\d/.test(password),
      /[a-z]/.test(password),
    ];
    if (!criteria.every(Boolean)) {
      addError({
        message: 'Password does not meet all criteria.',
        displayType: 'inline',
        category: 'validation',
      });
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center gap-8'>
      <Helmet>
        <title>BabelBeats | Reset Password</title>
      </Helmet>
      <div className='flex flex-row items-center gap-1.5'>
        <div className='rounded-full bg-primary p-1'>
          <img src={wave} className='w-6 h-6' alt='Wave' />
        </div>
        <div className='font-sans font-bold'>BabelBeats</div>
      </div>
      <div className='flex flex-col items-center justify-center gap-2'>
        <h1 className='text-4xl font-bold'>Create new password</h1>
      </div>

      <form className='flex flex-col gap-8' onSubmit={handlePasswordSubmit}>
        <InputField
          key='password'
          id='password'
          label='Password'
          type='password'
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            setPasswordTouched(true);
            clearError();
          }}
          displayCriteria={true}
          handleOnBlur={validateField}
          touched={passwordTouched}
          ref={inputRef}
        />
        <Button width='w-96' type='submit' variant='filled'>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
