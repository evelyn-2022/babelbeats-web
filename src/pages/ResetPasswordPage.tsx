import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { wave } from '../assets';
import { InputField, Button } from '../components';
import { resetPassword } from '../services';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { code } = state || {};
  const [password, setPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateField();
    if (!isValid || error) return;
    try {
      await resetPassword(code, password);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const validateField = () => {
    const criteria = [
      password.length >= 8,
      /\d/.test(password),
      /[a-z]/.test(password),
    ];
    if (criteria.every(Boolean)) {
      setError('');
      return true;
    }
    setError('Password does not meet all criteria.');
    return false;
  };

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
            setError('');
          }}
          displayCriteria={true}
          validationMessage={error}
          handleOnBlur={validateField}
          touched={passwordTouched}
        />
        <Button width='w-96' type='submit' variant='filled'>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
