import React, { useState, useEffect, useRef } from 'react';
import { SignupField } from './SignupField';
import { CustomError, ValidatedFields } from '../../types';
import { InputField, Button, SocialSignInGroup } from '../../components';
import { useError } from '../../context';
import { validateField } from '../../utils';

interface CardProps {
  step: number;
  total: number;
  field: SignupField;
  values: ValidatedFields;
  handleSubmit: (e: React.FormEvent) => void;
  resetPasswordVisibility: boolean;
}

const Card: React.FC<CardProps> = ({
  step,
  total,
  field,
  values,
  handleSubmit,
  resetPasswordVisibility,
}) => {
  const { errorState, addError, clearError } = useError();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputErrorSetter, setInputErrorSetter] = useState<React.Dispatch<
    React.SetStateAction<CustomError | null>
  > | null>(null);

  // Handler to pass to the child component to receive its setState method
  const handleSetStateFromChild = (
    setter: React.Dispatch<React.SetStateAction<CustomError | null>>
  ) => {
    setInputErrorSetter(() => setter); // Store the setter function
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputErrorSetter) return;

    const isValid = await validateField({
      id: field.id,
      values,
      addError,
      clearError,
      setError: inputErrorSetter,
    });

    if (!isValid || errorState.error) return;
    handleSubmit(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext(e as unknown as React.FormEvent);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  return (
    <form
      className='flex flex-col items-center gap-6 min-h-[316px]'
      onSubmit={handleNext}
      onKeyDown={handleKeyDown}
    >
      <InputField
        id={field.id}
        label={field.label}
        type={field.type}
        value={field.value}
        values={values}
        onChange={field.onChange}
        requireValidation={true}
        resetPasswordVisibility={resetPasswordVisibility}
        ref={inputRef}
        passSetStateToParent={handleSetStateFromChild}
      />

      <Button type='submit' variant='filled'>
        {step < total - 1 ? 'Next' : 'Submit'}
      </Button>

      {step === 0 && <SocialSignInGroup text='sign up' />}

      <a href='/login'>
        Already have an account? <span className='link'>Log in</span>
      </a>
    </form>
  );
};

export default Card;
