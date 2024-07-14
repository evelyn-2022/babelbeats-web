import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wave } from '../assets';
import { Card } from '../components';
import { Field } from '../types';

const EnterUserInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const fields: Field[] = [
    {
      label: 'Email',
      type: 'email',
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError('');
      },
    },
    {
      label: 'Password',
      type: 'password',
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError('');
      },
    },
    {
      label: 'Name',
      type: 'text',
      value: name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setError('');
      },
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < fields.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setIsSubmitted(true);
      alert('Form submitted!');
      navigate('/');
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const getCurrentValue = () => {
    const values = [email, password, name];
    return values[step] !== undefined ? values[step] : '';
  };

  const dividerWidth = isSubmitted
    ? '100%'
    : `${(step / fields.length) * 100}%`;

  return (
    <div className='min-h-screen w-full flex flex-col items-center gap-8 mt-40'>
      <div className='flex flex-row items-center gap-1.5'>
        <div className='rounded-full bg-primary p-1'>
          <img src={wave} className='w-6 h-6' alt='Wave' />
        </div>
        <div className='font-sans font-bold text-lg'>BabelBeats</div>
      </div>
      <h1 className='text-4xl font-bold'>Welcome!</h1>
      {step !== 0 && (
        <div>
          <div className='w-96 h-0.5 bg-gray-200 dark:bg-gray-600 relative'>
            <div
              className='absolute top-0 left-0 h-0.5 bg-primary transition-all duration-300'
              style={{ width: dividerWidth }}
            ></div>
          </div>
          <div>
            <span onClick={handlePrevious}>--</span>
            Step {step} of {fields.length}
          </div>
        </div>
      )}

      <Card
        step={step}
        total={fields.length}
        field={fields[step]}
        value={getCurrentValue()} // Values entered by users are passed down and persisted
        error={error}
        setError={setError}
        handleSubmit={handleSubmit}
        handlePrevious={handlePrevious}
      />
    </div>
  );
};

export default EnterUserInfoPage;
