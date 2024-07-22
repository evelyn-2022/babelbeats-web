import React, { useState, useEffect, useRef } from 'react';
import validator from 'validator';
import { SignupField } from './SignupField';
import { InputField, Button, SocialSignInGroup } from '../../components';
import { useError } from '../../context';

interface CardProps {
  step: number;
  total: number;
  field: SignupField;
  values: UserSignupInfo;
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
  handleSubmit,
  resetPasswordVisibility,
}) => {
  const [passwordTouched, setPasswordTouched] = useState(false);
  const { errorState, addError, clearError } = useError();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateField() || errorState.error) return;
    handleSubmit(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext(e as unknown as React.FormEvent);
    }
  };

  const validateField = () => {
    clearError();
    switch (field.label.toLowerCase()) {
      case 'email': {
        const value = values.email;
        if (!validator.isEmail(value)) {
          addError({
            message: 'Invalid email address.',
            displayType: 'inline',
            category: 'validation',
          });
          return false;
        }
        break;
      }
      case 'password': {
        const value = values.password;
        setPasswordTouched(true);
        const criteria = [
          value.length >= 8,
          /\d/.test(value),
          /[a-z]/.test(value),
        ];
        if (!criteria.every(Boolean)) {
          addError({
            message: 'Password does not meet criteria.',
            displayType: 'inline',
            category: 'validation',
          });
          return false;
        }
        break;
      }
      case 'confirm password': {
        const { password, passwordConfirm } = values;
        if (password !== passwordConfirm) {
          addError({
            message: 'Passwords do not match.',
            displayType: 'inline',
            category: 'validation',
          });
          return false;
        }
        break;
      }
      case 'username': {
        if (values.name.trim() === '') {
          addError({
            message: 'Username cannot be empty.',
            displayType: 'inline',
            category: 'validation',
          });
          return false;
        }
        break;
      }
      default:
        clearError();
    }
    return true;
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  return (
    <form
      className='flex flex-col gap-6'
      onSubmit={handleNext}
      onKeyDown={handleKeyDown}
    >
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
        handleOnBlur={validateField}
        touched={passwordTouched}
        resetPasswordVisibility={resetPasswordVisibility}
        ref={inputRef}
      />

      <Button type='submit' variant='filled' width='w-96' padding='p-2.5'>
        {step < total - 1 ? 'Next' : 'Submit'}
      </Button>

      {step === 0 && <SocialSignInGroup text='sign up' />}
    </form>
  );
};

export default Card;
