import React from 'react';
import { Link } from 'react-router-dom';

interface DropdownProps {
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  setShowDropdown,
  handleLogout,
}) => {
  const links = [
    { to: '/profile', label: 'Profile' },
    { to: '/account/account', label: 'Account' },
    { to: '/settings', label: 'Settings' },
  ];

  return (
    <div className='absolute flex flex-col right-0 mt-6 w-44 border shadow z-10 rounded cursor-pointer'>
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.to}
          className={`w-full hover:bg-gray-100 px-3 border-l-2 border-transparent py-2 dark:hover:border-primary dark:hover:bg-customBlack-light/95 ${
            index === 0 && 'rounded-t'
          }`}
          onClick={() => setShowDropdown(false)}
        >
          {link.label}
        </Link>
      ))}
      <div
        className='w-full hover:bg-gray-100 px-3 py-2 dark:hover:bg-primary rounded-b'
        onClick={handleLogout}
      >
        Log out
      </div>
    </div>
  );
};

export default Dropdown;
