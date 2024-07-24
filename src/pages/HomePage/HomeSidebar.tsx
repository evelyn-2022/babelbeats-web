import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BiHomeAlt2 } from 'react-icons/bi';
import { BsCollection } from 'react-icons/bs';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { LuSearch } from 'react-icons/lu';
import { PiPlaylist } from 'react-icons/pi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { GoPerson } from 'react-icons/go';
import { LuSettings } from 'react-icons/lu';
import { IoIosLogOut } from 'react-icons/io';
import { ProfilePic } from '../../components';
import { useAuth } from '../../context';

const HomeSidebar: React.FC = () => {
  const { authState } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const sidebarWidth = hidden
    ? 0
    : collapsed
    ? window.innerWidth * 0.068
    : window.innerWidth * 0.18;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const { clientX } = e;
      if (clientX >= sidebarWidth - 40 && clientX <= sidebarWidth + 40) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    },
    [sidebarWidth]
  );

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [collapsed, hidden, handleMouseMove]);

  const navLinks: Link[] = [
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
      to: '/collections',
      label: 'Collections',
      icon: <BsCollection className='text-lg' />,
    },
    {
      to: '/playlists',
      label: 'Playlists',
      icon: <PiPlaylist className='text-2xl -mr-1' />,
    },
  ];

  const settingLinks: Link[] = [
    {
      to: '/account',
      label: 'Account',
      icon: <GoPerson className='text-xl' />,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: <LuSettings className='text-xl' />,
    },
  ];

  const bottomLinks: Link[] = [
    {
      to: '/profile',
      label: authState.user?.name,
      icon: (
        <div className={`${!collapsed && '-ml-3 -mr-1'} w-8`}>
          <ProfilePic width='8' />
        </div>
      ),
    },
  ];

  interface Link {
    to: string;
    label: string | undefined;
    icon: JSX.Element;
  }

  interface LinkItemProps {
    link: Link;
  }

  const LinkItem: React.FC<LinkItemProps> = ({ link }) => {
    return (
      <div className='w-full'>
        <div
          className={`flex items-center w-full transition-all duration-300 delay-200 ease-in-out ${
            collapsed ? 'justify-center' : 'pl-1.5'
          }`}
        >
          <span className='flex items-center justify-center'>{link.icon}</span>
          <span
            className={`transition-opacity duration-300 ml-4 whitespace-nowrap overflow-hidden ${
              collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'
            }`}
          >
            {link.label}
          </span>
        </div>
      </div>
    );
  };

  const baseClasses = `p-3 rounded-full flex items-center justify-center mb-2 h-12`;
  const activeClasses =
    'bg-customBlack-light/[.03] dark:text-primary dark:bg-customBlack-light/95';
  const inactiveClasses =
    'hover:bg-customBlack-light/5 dark:hover:bg-customBlack-light/50';

  return (
    <div className='min-h-screen flex w-full relative'>
      {/* Left column */}
      {!hidden && (
        <div
          className={`${
            collapsed ? 'w-[6.8%]' : 'w-[18%]'
          } transition-all duration-300 px-6 py-8 flex flex-col relative justify-between`}
        >
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
                  >
                    <LinkItem link={link} />
                  </NavLink>
                </li>
              ))}
            </div>
          </ul>
          <ul className='flex flex-col mt-auto relative'>
            <div className={`flex flex-col mb-6`}>
              {settingLinks.map((link, i) => (
                <li
                  key={link.to}
                  style={{
                    transform: `translateY(${
                      isSettingsOpen
                        ? '0'
                        : `${(settingLinks.length + 1 - i) * 70}px`
                    })`,
                    opacity: isSettingsOpen ? 1 : 0,
                    transition:
                      'transform 300ms ease-in-out, opacity 300ms ease-in',
                    pointerEvents: isSettingsOpen ? 'auto' : 'none',
                  }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => {
                      return `${baseClasses} ${
                        isActive ? activeClasses : inactiveClasses
                      }`;
                    }}
                  >
                    <LinkItem link={link} />
                  </NavLink>
                </li>
              ))}
              <li
                className={`${baseClasses} ${inactiveClasses}`}
                style={{
                  transform: `translateY(${isSettingsOpen ? '0' : `70px`})`,
                  opacity: isSettingsOpen ? 1 : 0,
                  transition:
                    'transform 300ms ease-in-out, opacity 300ms ease-in',
                  pointerEvents: isSettingsOpen ? 'auto' : 'none',
                }}
              >
                <LinkItem
                  link={{
                    to: '/',
                    label: 'Log out',
                    icon: <IoIosLogOut className='text-xl' />,
                  }}
                />
              </li>
            </div>
            <div className='flex flex-col z-10 group'>
              <li key={'profile'}>
                <NavLink
                  to={'/profile'}
                  className={({ isActive }) => {
                    return `relative ${baseClasses} ${
                      isActive ? activeClasses : inactiveClasses
                    }`;
                  }}
                >
                  <LinkItem link={bottomLinks[0]} />
                  <div
                    className={`${
                      collapsed && 'absolute top-1/2 -translate-y-1/2 -right-5'
                    }`}
                  >
                    <BsThreeDotsVertical
                      className='opacity-0 group-hover:opacity-100 text-xl text-customBlack-light/30 dark:text-customWhite/40'
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    />
                  </div>
                </NavLink>
              </li>
            </div>
          </ul>
        </div>
      )}

      {/* Right column */}
      <div className='px-6 py-8 flex-grow bg-customBlack-light/[.03] dark:bg-customBlack-light/95 relative'>
        {/* Collapse/expand icons */}
        <div
          className={`absolute top-1/2 -left-[18px] flex flex-row cursor-pointer text-customWhite/40 text-xl ${
            isHovering ? 'opacity-100' : 'opacity-0'
          } transition-all duration-300`}
        >
          <FaCaretLeft
            onClick={
              collapsed ? () => setHidden(true) : () => setCollapsed(true)
            }
            className='hover:-translate-x-0.5 transition-all duration-300'
          />
          <FaCaretRight
            onClick={
              hidden
                ? () => setHidden(false)
                : collapsed
                ? () => setCollapsed(false)
                : () => {}
            }
            className={`hover:translate-x-0.5 transition-all duration-300 -ml-1 ${
              !collapsed && 'hidden'
            }`}
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default HomeSidebar;
