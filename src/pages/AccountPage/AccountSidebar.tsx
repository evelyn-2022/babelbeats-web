import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { GoPerson } from 'react-icons/go';
import { IoIosLogOut } from 'react-icons/io';
import { PiArrowLeftBold } from 'react-icons/pi';
import { GrLanguage } from 'react-icons/gr';
import { SlSettings } from 'react-icons/sl';
import { Button } from '../../components';
import { useAuthService } from '../../hooks';

const AccountSidebar: React.FC = () => {
  const { handleSignOut } = useAuthService();

  const navLinks = [
    { to: 'account', label: 'Account', icon: <GoPerson className='text-xl' /> },
    {
      to: 'language',
      label: 'Language',
      icon: <GrLanguage className='text-lg' />,
    },
    {
      to: 'settings',
      label: 'Settings',
      icon: <SlSettings className='text-xl' />,
    },
  ];

  const baseClasses = 'block p-3 rounded-sm border-l-2';
  const activeClasses =
    'border-primary bg-customBlack-light/[.03] dark:text-primary dark:border-primary dark:bg-customBlack-light/95';
  const inactiveClasses =
    'border-transparent hover:border-primary-dark hover:bg-customBlack-light/5 dark:hover:bg-customBlack-light/50';

  return (
    <div className='min-h-screen flex flex-col w-full'>
      <div className='flex flex-grow'>
        {/* Left Column */}
        <div className='w-3/12 pl-14 pr-6 py-8 flex flex-col flex-grow gap-8'>
          <Link to='/'>
            <Button width='w-36' variant='filled'>
              <div className='flex flex-row gap-2 items-center'>
                <PiArrowLeftBold className='text-lg' />
                Go back
              </div>
            </Button>
          </Link>

          <ul className='flex flex-col flex-grow justify-between'>
            <div className='flex flex-col'>
              {navLinks.map(link => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => {
                      return `${baseClasses} ${
                        isActive ? activeClasses : inactiveClasses
                      }`;
                    }}
                  >
                    <div className='flex items-center gap-4'>
                      {link.icon && <span>{link.icon}</span>}
                      {link.label}
                    </div>
                  </NavLink>
                </li>
              ))}
            </div>
            <li
              className={`${baseClasses} ${inactiveClasses} flex flex-row items-center gap-3`}
              onClick={handleSignOut}
            >
              <IoIosLogOut className='text-xl' />
              Logout
            </li>
          </ul>
        </div>

        {/* Right Column */}
        <div className='w-9/12 pl-6 pr-14 py-8 flex-grow bg-customBlack-light/[.03] dark:bg-customBlack-light/95'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountSidebar;
