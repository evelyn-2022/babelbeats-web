import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import SocialSignInBtn from './SocialSignInBtn';
import { useAuthService } from '../../hooks';

const SocialSignInGroup = ({ text }: { text: string }) => {
  const { handleGoogleSignIn, handleFBSignIn, handleAppleSignIn } =
    useAuthService();

  const buttons = [
    { onClick: handleGoogleSignIn, icon: <FaGoogle className='w-6 h-6' /> },
    { onclick: handleFBSignIn, icon: <FaFacebookF className='w-6 h-6' /> },
    { onclick: handleAppleSignIn, icon: <FaApple className='w-6 h-6' /> },
  ];

  return (
    <div className='flex flex-col gap-6 items-center'>
      <div className='relative flex items-center w-64 md:w-96'>
        <div className='flex-grow border-t border-customBlack-light/10 dark:border-customWhite/70'></div>
        <span className='flex-shrink mx-4'>or {text} with</span>
        <div className='flex-grow border-t border-customBlack-light/10 dark:border-customWhite/70'></div>
      </div>
      <div className='flex space-x-3 md:space-x-4'>
        {buttons.map((button, index) => (
          <SocialSignInBtn
            key={index}
            onClick={button.onClick}
            icon={button.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default SocialSignInGroup;
