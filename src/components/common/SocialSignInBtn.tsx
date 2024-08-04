import React from 'react';

interface SocialIconProps {
  onClick?: () => void;
  icon: React.ReactNode;
}

const SocialSignInBtn: React.FC<SocialIconProps> = ({ onClick, icon }) => {
  return (
    <button
      className='border border-customBlack-light/10 p-2 md:p-3 rounded-lg bg-customWhite hover:bg-customBlack-light hover:border-customBlack-light hover:text-white active:bg-customBlack-dark dark:bg-customBlack dark:text-white dark:border-primary-dark glowing-outline transition duration-500'
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default SocialSignInBtn;
