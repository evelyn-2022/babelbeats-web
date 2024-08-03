import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BsChevronLeft } from 'react-icons/bs';
import { wave } from '../../assets';
import Card from './Card';
import { SignupField } from './SignupField';
import { useError } from '../../context';
import { useAuthService } from '../../hooks';

const SignupPage: React.FC = () => {
  const { clearError } = useError();
  const { handleSignUp } = useAuthService();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [resetPasswordVisibility, setResetPasswordVisibility] = useState(false);

  const fields: SignupField[] = [
    {
      id: 'email',
      label: 'Email',
      type: 'text',
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        clearError();
      },
      description: 'Enter your email address',
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        clearError();
      },
      description: 'Create a password',
    },
    {
      id: 'passwordConfirm',
      label: 'Confirm Password',
      type: 'password',
      value: passwordConfirm,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirm(e.target.value);
        clearError();
      },
      description: 'Confirm your password',
    },
    {
      id: 'name',
      label: 'Username',
      type: 'text',
      value: name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        clearError();
      },
      description: 'Create a username',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < fields.length - 1) {
      setStep(prev => prev + 1);
      setResetPasswordVisibility(true);
    } else {
      try {
        await handleSignUp(email, password, name);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
    setResetPasswordVisibility(true);
    clearError();
  };

  useEffect(() => {
    if (resetPasswordVisibility) {
      setResetPasswordVisibility(false);
    }
  }, [resetPasswordVisibility]);

  const dividerWidth = `${(step / (fields.length - 1)) * 100}%`;

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center gap-8'>
      <Helmet>
        <title>BabelBeats | Sign Up</title>
      </Helmet>
      <div className='flex flex-row items-center gap-1.5'>
        <div className='rounded-full bg-primary p-1'>
          <img src={wave} className='w-6 h-6' alt='Wave' />
        </div>
        <div className='font-sans font-bold text-lg'>BabelBeats</div>
      </div>
      <h1 className='text-4xl font-bold'>Welcome!</h1>
      {step !== 0 && (
        <div>
          <div className='w-96 h-0.5 bg-customBlack-light/10 dark:bg-customWhite/80 relative'>
            <div
              className='absolute top-0 left-0 h-0.5 bg-primary-dark dark:bg-primary transition-all duration-300'
              style={{ width: dividerWidth }}
            ></div>
          </div>
          <div className='flex flex-row items-center gap-2 mt-1'>
            <span
              className='cursor-pointer text-2xl text-customBlack-light/30 dark:text-customWhite/80'
              onClick={handlePrevious}
            >
              <BsChevronLeft />
            </span>
            <div>
              <div className='text-customBlack-light/50 dark:text-customWhite/80'>
                Step {step} of {fields.length - 1}
              </div>
              <div className='font-bold'>{fields[step].description}</div>
            </div>
          </div>
        </div>
      )}
      <Card
        step={step}
        total={fields.length}
        field={fields[step]}
        values={{ email, password, passwordConfirm, name }}
        handleSubmit={handleSubmit}
        resetPasswordVisibility={resetPasswordVisibility}
      />
    </div>
  );
};

export default SignupPage;
