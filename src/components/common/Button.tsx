import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'outlined' | 'filled';
  width: string;
  padding?: string;
  type?: 'submit' | 'reset' | undefined;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled,
  variant = 'default',
  width,
  padding,
  type,
  children,
}) => {
  let className = ` border-2 cursor-pointer text-center font-bold flex justify-center items-center rounded-full button-hover-animation transition duration-500 ${width} ${
    padding ? padding : 'p-2.5'
  }`;

  switch (variant) {
    case 'outlined':
      className +=
        ' border-customBlack-light hover:bg-customBlack hover:border-customBlack hover:text-white active:border-customBlack-dark active:bg-customBlack-dark';
      break;
    case 'filled':
      className +=
        ' border-customBlack-light bg-customBlack-light text-white hover:bg-customBlack hover:border-customBlack active:border-customBlack-dark active:bg-customBlack-dark dark:bg-primary dark:border-primary dark:text-customBlack dark:hover:bg-primary dark:hover:border-primary glowing-outline';
      break;
    default:
      className += ' border-gray-100';
      break;
  }

  return (
    <button
      className={className}
      onClick={onClick}
      type={type ? type : 'button'}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
