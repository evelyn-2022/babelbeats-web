import React, { useState, useEffect, forwardRef } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { PiWarningCircle, PiCircle, PiCheckCircleFill } from 'react-icons/pi';
import { useError } from '../../context';
import { validateField } from '../../utils';
import { CustomError, ValidatedFields } from '../../types';

interface InputFieldProps {
  id?: keyof ValidatedFields;
  label?: string;
  type: string;
  value: string;
  values?: ValidatedFields;
  width?: string;
  padding?: string;
  bgColor?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  requireValidation?: boolean;
  validationMessage?: string;
  resetPasswordVisibility?: boolean;
  placeholder?: string;
  passSetStateToParent?: (
    setter: React.Dispatch<React.SetStateAction<CustomError | null>>
  ) => void;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      label,
      type,
      value,
      values,
      width,
      padding,
      bgColor = 'bg-customWhite dark:bg-customBlack',
      onChange,
      requireValidation,
      resetPasswordVisibility,
      placeholder,
      passSetStateToParent,
    },
    ref
  ) => {
    const { addError, clearError } = useError();
    const [error, setError] = useState<CustomError | null>(null);
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState(false);

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
      // Pass the setter function to the parent
      if (passSetStateToParent) passSetStateToParent(setError);
    }, [passSetStateToParent]);

    useEffect(() => {
      if (resetPasswordVisibility) {
        setShowPassword(false);
      }
    }, [resetPasswordVisibility]);

    useEffect(() => {
      if (value) {
        setTouched(true);
      } else {
        setTouched(false);
      }
    }, [label]);

    return (
      <div className='flex flex-col gap-1 w-full'>
        <div
          className={`relative self-center ${width ? width : 'w-64 md:w-96'}`}
        >
          {label && (
            <label
              className={`absolute ${bgColor} px-1.5 left-3 top-1/2 transition-transform duration-200 ease-in ${
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
            ref={ref}
            type={type === 'password' && showPassword ? 'text' : type}
            className={`border rounded-lg p-3 border-customBlack-light/10 ${bgColor} text-customBlack-light dark:border-customWhite/70 dark:text-white focus:outline-none focus:border-primary-dark dark:focus:border-primary w-full ${padding}`}
            value={value}
            onChange={e => {
              onChange(e);
              setTouched(true);
              setError(null);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              if (touched && requireValidation && id && values) {
                validateField({
                  id,
                  values,
                  addError,
                  clearError,
                  setError,
                });
              }
            }}
            placeholder={placeholder}
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
          className={`text-red-500 text-xs md:text-sm flex flex-row items-center gap-0.5 max-w-64 md:max-w-96 ${
            (!error || !touched) && 'hidden'
          }`}
        >
          <PiWarningCircle />
          {error && error.message}
        </div>

        {(label?.toLowerCase() === 'password' || id === 'password') &&
          requireValidation && (
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
  }
);

export default InputField;
