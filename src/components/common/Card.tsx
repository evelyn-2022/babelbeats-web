import React, { useState } from 'react';
import { Field } from '../../types';
import { InputField, Button, SocialSignInGroup } from '../common';

interface CardProps {
  step: number;
  total: number;
  field: Field;
  value: string;
  error: string;
  setError: (error: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handlePrevious: () => void;
}

const Card: React.FC<CardProps> = ({
  step,
  total,
  field,
  value,
  error,
  setError,
  handleSubmit,
}) => {
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    handleSubmit(e);
  };

  const validateField = () => {
    switch (field.type) {
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setError('Please enter a valid email address.');
        } else {
          setError('');
        }
        break;
      }
      case 'password': {
        setPasswordTouched(true);
        const criteria = [
          value.length >= 8,
          /\d/.test(value),
          /[a-z]/.test(value),
        ];
        if (criteria.every(Boolean)) {
          setError('');
        } else {
          setError('Password does not meet all criteria.');
        }
        break;
      }
      case 'text': {
        if (value.trim() === '') {
          setError('This field is required.');
        } else {
          setError('');
        }
        break;
      }
      default:
        setError('');
    }
  };

  return (
    <form className='flex flex-col gap-6' onSubmit={handleNext}>
      <div className='mt-4 mb-6'>
        <InputField
          id={field.label.toLowerCase()}
          label={field.label}
          type={field.type}
          value={value}
          onChange={e => {
            field.onChange(e);
            if (field.type === 'password') {
              setPasswordTouched(true);
            }
          }}
          validationMessage={error}
          onBlur={validateField}
          showPasswordCriteria={field.type === 'password'}
          touched={passwordTouched}
        />
      </div>

      <Button type='submit' variant='filled' width='w-96' padding='p-2.5'>
        {step < total - 1 ? 'Next' : 'Submit'}
      </Button>

      {step === 0 && <SocialSignInGroup text='sign up' />}
    </form>
  );
};

export default Card;
