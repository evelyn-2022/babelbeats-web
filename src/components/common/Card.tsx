import React, { useState } from 'react';
import validator from 'validator';
import { SignupField } from '../../types';
import { InputField, Button, SocialSignInGroup } from '../common';

interface CardProps {
  step: number;
  total: number;
  field: SignupField;
  values: UserSignupInfo;
  error: string;
  setError: (error: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetPasswordVisibility: boolean;
}

interface UserSignupInfo {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
}

const Card: React.FC<CardProps> = ({
  step,
  total,
  field,
  values,
  error,
  setError,
  handleSubmit,
  resetPasswordVisibility,
}) => {
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateField();
    if (!isValid || error) return;
    handleSubmit(e);
  };

  const validateField = () => {
    switch (field.label.toLowerCase()) {
      case 'email': {
        const value = values.email;
        if (!validator.isEmail(value)) {
          setError('Please enter a valid email address.');
          return false;
        }
        setError('');
        return true;
      }
      case 'password': {
        const value = values.password;
        setPasswordTouched(true);
        const criteria = [
          value.length >= 8,
          /\d/.test(value),
          /[a-z]/.test(value),
        ];
        if (criteria.every(Boolean)) {
          setError('');
          return true;
        }
        setError('Password does not meet all criteria.');
        return false;
      }
      case 'confirm password': {
        const { password, passwordConfirm } = values;
        if (password !== passwordConfirm) {
          setError('Passwords do not match.');
          return false;
        }
        setError('');
        return true;
      }
      case 'username': {
        if (values.name.trim() === '') {
          setError('Username cannot be empty.');
          return false;
        }
        setError('');
        return true;
      }
      default:
        setError('');
        return true;
    }
  };

  return (
    <form className='flex flex-col gap-6' onSubmit={handleNext}>
      <InputField
        id={field.label.toLowerCase()}
        label={field.label}
        type={field.type}
        value={field.value}
        onChange={e => {
          field.onChange(e);
          if (field.type === 'password') {
            setPasswordTouched(true);
          }
        }}
        displayCriteria={true}
        validationMessage={error}
        handleOnBlur={validateField}
        touched={passwordTouched}
        resetPasswordVisibility={resetPasswordVisibility}
      />

      <Button type='submit' variant='filled' width='w-96' padding='p-2.5'>
        {step < total - 1 ? 'Next' : 'Submit'}
      </Button>

      {step === 0 && <SocialSignInGroup text='sign up' />}
    </form>
  );
};

export default Card;
