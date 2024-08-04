import React, { useState, useEffect, useRef } from 'react';
import { Button, Dropdown, Logo } from '../../components';
import { useAuth, useTheme } from '../../context';
import { useAuthService } from '../../hooks';

const Navbar: React.FC = () => {
  const { authState } = useAuth();
  const { handleSignOut } = useAuthService();
  const { theme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = () => {
    setShowDropdown(prev => !prev);
  };

  const handleLogout = () => {
    setShowDropdown(false);
    handleSignOut();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className='py-3 flex justify-between items-center relative w-full'>
      <a href='/' className='cursor-pointer'>
        <Logo />
      </a>

      {authState.user ? (
        <div className='relative' ref={dropdownRef}>
          <div
            className='flex flex-row items-center gap-1 cursor-pointer'
            onClick={handleProfileClick}
          >
            {authState.user.profilePic ? (
              <>
                <img
                  src={authState.user.profilePic}
                  alt='profile picture'
                  className='rounded-full w-8'
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.style.display = 'none';
                    if (target.nextSibling) {
                      (target.nextSibling as HTMLElement).style.display =
                        'flex';
                    }
                  }}
                  style={{
                    display: authState.user.profilePic ? 'block' : 'none',
                  }}
                />
                <div
                  className='flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded-full text-xl font-bold'
                  style={{ display: 'none' }}
                >
                  {authState.user.name.charAt(0)}
                </div>
              </>
            ) : (
              <div className='flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded-full text-xl font-bold'>
                {authState.user.name.charAt(0)}
              </div>
            )}
          </div>

          {showDropdown && (
            <Dropdown
              setShowDropdown={setShowDropdown}
              handleLogout={handleLogout}
            />
          )}
        </div>
      ) : (
        <a href='/get-started'>
          <Button
            variant={theme === 'light' ? 'outlined' : 'filled'}
            width='w-28 md:w-36'
          >
            Get Started
          </Button>
        </a>
      )}
    </nav>
  );
};

export default Navbar;
