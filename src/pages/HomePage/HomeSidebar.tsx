import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BiHomeAlt2 } from 'react-icons/bi';
import { TbPlaylist } from 'react-icons/tb';
import { RiPlayList2Line } from 'react-icons/ri';
import { BsCollection } from 'react-icons/bs';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { LuSearch } from 'react-icons/lu';
import { ProfilePic } from '../../components';
import { SlSettings } from 'react-icons/sl';

const HomeSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = e => {
    const { clientX } = e;
    const sidebarWidth = hidden
      ? 0
      : collapsed
      ? window.innerWidth * 0.068
      : window.innerWidth * 0.16667;
    if (clientX >= sidebarWidth - 40 && clientX <= sidebarWidth + 40) {
      setIsHovering(true);
    } else {
      setIsHovering(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [collapsed, hidden]);

  const navLinks = [
    {
      to: '/',
      label: 'Home',
      icon: <BiHomeAlt2 className='text-2xl' />,
    },
    {
      to: 'search',
      label: 'Search',
      icon: <LuSearch className='text-xl' />,
    },
    {
      to: '/recent',
      label: 'Recently played',
      icon: <RiPlayList2Line className='text-xl' />,
    },
    {
      to: '/playlists',
      label: 'Playlists',
      icon: <TbPlaylist className='text-2xl -mr-1' />,
    },
    {
      to: '/collections',
      label: 'Collections',
      icon: <BsCollection className='text-lg' />,
    },
  ];

  const bottomLinks = [
    {
      to: '/settings',
      label: 'Settings',
      icon: <SlSettings className='text-xl' />,
    },
    {
      to: '/profile',
      label: 'Profile',
      icon: (
        <div className={`${!collapsed && '-ml-2 -mr-1'}`}>
          <ProfilePic width='8' />
        </div>
      ),
    },
  ];

  const baseClasses =
    'block p-3 rounded-full flex items-center justify-center mb-2';
  const activeClasses =
    'bg-customBlack-light/[.03] dark:text-primary dark:bg-customBlack-light/95';
  const inactiveClasses =
    'hover:bg-customBlack-light/5 dark:hover:bg-customBlack-light/50';

  return (
    <div className='min-h-screen flex w-full'>
      {!hidden && (
        <div
          className={`${
            collapsed ? 'w-[6.8%]' : 'w-2/12'
          } transition-all duration-300 px-6 py-8 flex flex-col relative justify-between `}
        >
          <div
            className={`absolute flex flex-row mt-4 justify-center top-[358px] -right-1 ${
              isHovering ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}
          >
            <div className='cursor-pointer text-xl text-customWhite/40 '>
              {collapsed ? (
                <FaCaretLeft
                  onClick={() => {
                    setHidden(true);
                  }}
                />
              ) : (
                <FaCaretLeft
                  onClick={() => {
                    setCollapsed(true);
                  }}
                />
              )}
            </div>
          </div>
          <ul className='flex flex-col mt-8'>
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
                    style={{
                      height: '50px',
                      width: collapsed ? '50px' : 'auto',
                    }}
                  >
                    <div
                      className={`flex items-center w-full transition-all duration-300 ease-in-out ${
                        collapsed ? 'justify-center' : 'pl-3'
                      }`}
                    >
                      <span className='flex items-center justify-center'>
                        {link.icon}
                      </span>
                      <span
                        className={`transition-opacity duration-300 ml-4 ${
                          collapsed
                            ? 'opacity-0 w-0 hidden'
                            : 'opacity-100 w-auto'
                        }`}
                        style={{
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          transition: 'width 0.3s',
                        }}
                      >
                        {link.label}
                      </span>
                    </div>
                  </NavLink>
                </li>
              ))}
            </div>
          </ul>
          <ul className='flex flex-col mt-auto'>
            <div className='flex flex-col mb-6'>
              {bottomLinks.map(link => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => {
                      return `${baseClasses} ${
                        isActive ? activeClasses : inactiveClasses
                      }`;
                    }}
                    style={{
                      height: '50px',
                      width: collapsed ? '50px' : 'auto',
                    }}
                  >
                    <div
                      className={`flex items-center w-full transition-all duration-300 ease-in-out ${
                        collapsed ? 'justify-center' : 'pl-3'
                      }`}
                    >
                      <span className='flex items-center justify-center'>
                        {link.icon}
                      </span>
                      <span
                        className={`transition-opacity duration-300 ml-4 ${
                          collapsed
                            ? 'opacity-0 w-0 hidden'
                            : 'opacity-100 w-auto'
                        }`}
                        style={{
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          transition: 'width 0.3s',
                        }}
                      >
                        {link.label}
                      </span>
                    </div>
                  </NavLink>
                </li>
              ))}
            </div>
          </ul>
        </div>
      )}

      <div className='px-6 py-8 flex-grow bg-customBlack-light/[.03] dark:bg-customBlack-light/95 relative'>
        <div
          className={`cursor-pointer text-customWhite/40 text-xl absolute -left-1 top-[374px] ${
            isHovering ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
        >
          {hidden ? (
            <FaCaretRight
              onClick={() => {
                setHidden(false);
              }}
            />
          ) : collapsed ? (
            <FaCaretRight
              onClick={() => {
                setCollapsed(false);
              }}
            />
          ) : (
            ''
          )}
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default HomeSidebar;
