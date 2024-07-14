import React, { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

interface InputFieldProps {
  id?: string;
  label?: string;
  type: string;
  value: string;
  width?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  width,
  onChange,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  return (
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
        onBlur={() => setFocused(false)}
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
  );
};

export default InputField;
