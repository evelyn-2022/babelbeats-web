import React, { useState, ChangeEvent } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

interface InputFieldProps {
  id?: string;
  label?: string;
  type: string;
  value: string;
  width?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationMessage?: string;
  onBlur?: () => void;
  showPasswordCriteria?: boolean;
  touched?: boolean; // Add touched prop
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  width,
  onChange,
  validationMessage,
  onBlur,
  showPasswordCriteria = false,
  touched = false, // Default to false
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

  return (
    <>
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
            if (onBlur) {
              onBlur();
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
      <div>
        {!focused && validationMessage && (
          <div className='text-red-500 text-sm mt-1'>{validationMessage}</div>
        )}

        {type === 'password' && showPasswordCriteria && (
          <div className='mt-2'>
            {passwordCriteria.map((criteria, index) => (
              <div key={index} className='flex items-center mt-1'>
                <input
                  type='radio'
                  className={`form-radio h-4 w-4 ${
                    criteria.valid ? 'text-green-500' : 'text-red-500'
                  }`}
                  checked={criteria.valid}
                  readOnly
                />
                <span
                  className={`ml-2 text-sm ${
                    !focused && touched && !criteria.valid
                      ? 'text-red-500'
                      : 'text-black'
                  }`}
                >
                  {criteria.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default InputField;
