import React, { useState, useEffect } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { PiWarningCircle, PiCircle, PiCheckCircleFill } from 'react-icons/pi';

interface InputFieldProps {
  id?: string;
  label?: string;
  type: string;
  value: string;
  width?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  displayCriteria?: boolean;
  validationMessage?: string;
  handleOnBlur?: () => void;
  touched?: boolean;
  resetPasswordVisibility?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  width,
  onChange,
  displayCriteria,
  validationMessage,
  handleOnBlur,
  touched,
  resetPasswordVisibility,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const passwordCriteria = [
    {
      label: 'Contains at least 1 lowercase letter',
      valid: /[a-z]/.test(value),
    },
    { label: 'Contains at least 1 number', valid: /\d/.test(value) },
    { label: 'Minimum 8 characters', valid: value.length >= 8 },
  ];

  useEffect(() => {
    if (resetPasswordVisibility) {
      setShowPassword(false);
    }
  }, [resetPasswordVisibility]);

  return (
    <div className='flex flex-col gap-1'>
      <div className={`relative ${width ? width : 'w-96'}`}>
        {label && (
          <label
            className={`absolute bg-customWhite dark:bg-customBlack px-1.5 left-3 top-1/2 transition-transform duration-200 ease-in ${
              focused
                ? 'transform -translate-y-9 text-customBlack-light dark:text-white'
                : value
                ? 'transform -translate-y-9 text-customBlack-light/50 dark:text-customWhite/80'
                : 'transform -translate-y-1/2 text-customBlack-light/50 dark:text-customWhite/80'
            }`}
            htmlFor={id}
          >
            {label}
          </label>
        )}

        <input
          id={id}
          type={type === 'password' && showPassword ? 'text' : type}
          className={`border rounded-lg p-3 border-customBlack-light/10 bg-customWhite text-customBlack-light dark:border-customWhite/70 dark:bg-customBlack dark:text-white focus:outline-none focus:border-primary-dark dark:focus:border-primary w-full`}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            if (handleOnBlur) {
              handleOnBlur();
            }
          }}
          required
        />

        {type === 'password' && (
          <div
            className='absolute inset-y-0 right-3 flex items-center cursor-pointer'
            onClick={togglePasswordVisibility}
          >
            <div className='text-customBlack-light/40 dark:text-white/60 text-lg'>
              {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </div>
          </div>
        )}
      </div>

      <div
        className={`text-red-500 text-sm flex flex-row items-center gap-0.5 ${
          !validationMessage && 'hidden'
        }`}
      >
        <PiWarningCircle />
        {validationMessage}
      </div>

      {label?.toLowerCase() === 'password' && displayCriteria && (
        <div className='mt-2'>
          {passwordCriteria.map((criteria, index) => (
            <div key={index} className='flex items-center mt-1'>
              {criteria.valid ? (
                <span className='text-primary-dark/80 dark:text-primary'>
                  <PiCheckCircleFill />
                </span>
              ) : (
                <span className='text-customBlack/50 dark:text-customWhite/50'>
                  <PiCircle />
                </span>
              )}
              <span
                className={`ml-2 text-sm ${
                  !focused && touched && !criteria.valid
                    ? 'text-red-500'
                    : 'text-customBlack dark:text-customWhite'
                }`}
              >
                {criteria.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputField;
