import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <div className='flex items-center space-x-2'>
      <label htmlFor='rememberMe' className='flex items-center cursor-pointer'>
        <div className='relative'>
          <input
            id='rememberMe'
            type='checkbox'
            className='sr-only'
            checked={checked}
            onChange={onChange}
          />
          <div
            className={`block border w-10 h-5 rounded-full ${
              checked
                ? 'border-primary bg-primary'
                : 'border-customBlack-light/10 dark:border-white'
            }`}
          ></div>
          <div
            className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full transition transform ${
              checked
                ? 'translate-x-5 bg-white dark:bg-customBlack'
                : 'translate-x-0 bg-customBlack-light/20 dark:bg-white'
            }`}
          ></div>
        </div>
        <span className='ml-2'>Remember me</span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
