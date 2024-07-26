import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BiHomeAlt2 } from 'react-icons/bi';
import { BsCollection, BsThreeDotsVertical } from 'react-icons/bs';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { LuSearch } from 'react-icons/lu';
import { PiPlaylist } from 'react-icons/pi';
import { GoPerson } from 'react-icons/go';
import { LuSettings } from 'react-icons/lu';
import { IoIosLogOut } from 'react-icons/io';
import { ProfilePic, Tooltip } from '../../components';
import { useAuth } from '../../context';

const HomeSidebar: React.FC = () => {
  const { authState } = useAuth();
  const [sidebarState, setSidebarState] = useState(1); // 0: hidden, 1: collapsed, 2: full
  const [isHovering, setIsHovering] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLUListElement>(null);
  const profileRef = useRef<HTMLLIElement>(null);
  const startPosition = useRef(0); // To store the initial mouse down position
  const threshold = 50; // px

  const sidebarWidth =
    sidebarState === 0
      ? 0
      : sidebarState === 1
      ? window.innerWidth * 0.068
      : window.innerWidth * 0.14;

  const handleMouseDown = (event: React.MouseEvent) => {
    startPosition.current = event.clientX;
    document.addEventListener('mousemove', handleMouseDrag);
    document.addEventListener('mouseup', handleMouseUp);
  };

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

  const handleMouseDrag = (e: MouseEvent) => {
    const currentMousePosition = e.clientX;
    const distanceMoved = currentMousePosition - startPosition.current;

    if (Math.abs(distanceMoved) >= threshold) {
      if (distanceMoved > 0) {
        // Mouse moved to the right
        setSidebarState(prev => (prev < 2 ? prev + 1 : 2));
      } else if (distanceMoved < 0) {
        // Mouse moved to the left
        setSidebarState(prev => (prev > 0 ? prev - 1 : 0));
      }
      startPosition.current = currentMousePosition; // Reset start position after state change
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mousemove', handleMouseDrag);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sidebarState, handleMouseMove]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const basicLinks: Link[] = [
    {
      to: '/',
      label: 'Home',
      icon: <BiHomeAlt2 className='text-[1.3rem] -mr-[0.05rem]' />,
    },
    {
      to: '/search',
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
      icon: <PiPlaylist className='text-2xl -ml-0.5 -mr-1' />,
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

  const profileLink: Link = {
    to: '/profile',
    label: authState.user?.name.split(' ')[0],
    icon: (
      <div className={`${sidebarState !== 1 && '-ml-2 -mr-1'} w-8`}>
        <ProfilePic width='8' />
      </div>
    ),
  };

  interface Link {
    to: string;
    label: string | undefined;
    icon: JSX.Element;
  }

  interface LinkItemProps {
    link: Link;
    position?: 'left' | 'right' | 'top' | 'bottom' | 'right-tight';
  }

  const LinkItem: React.FC<LinkItemProps> = ({ link, position }) => {
    return (
      <div className='w-full relative'>
        <div
          className={`flex items-center w-full transition-all duration-300 ease-in-out ${
            sidebarState === 1 ? 'justify-center' : 'pl-1.5'
          }`}
        >
          <span className='flex items-center justify-center'>{link.icon}</span>
          <span
            className={`ml-4 whitespace-nowrap overflow-hidden ${
              sidebarState === 1 ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'
            }`}
          >
            {link.label}
          </span>
        </div>
        {sidebarState === 1 && (
          <Tooltip label={link.label || ''} position={position} />
        )}
      </div>
    );
  };

  const baseClasses = `p-3 rounded-full flex items-center justify-center mb-2 h-12 relative`;
  const activeClasses =
    'bg-customBlack-light/[.03] dark:text-primary dark:bg-customBlack-lighter';
  const inactiveClasses =
    'hover:bg-customBlack-light/5 dark:hover:bg-customBlack-light';

  return (
    <div className='min-h-screen flex w-full relative'>
      {/* Left column */}
      {sidebarState !== 0 && (
        <div
          className={`${
            sidebarState === 1 ? 'w-[6.8%]' : 'w-[14%]'
          } transition-all duration-300 px-6 py-10 flex flex-col relative justify-between`}
        >
          {/* Basic links */}
          <ul>
            {basicLinks.map(link => (
              <li key={link.to} className='group '>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => {
                    return `${baseClasses} ${
                      isActive ? activeClasses : inactiveClasses
                    }`;
                  }}
                >
                  <LinkItem link={link} position='right' />
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Setting links */}
          <ul className='relative z-10' ref={settingsRef}>
            {settingLinks.map((link, i) => (
              <li
                className={`transition-all duration-300 ease-in-out group ${
                  isSettingsOpen
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
                key={link.to}
                style={{
                  transform: `translateY(${
                    isSettingsOpen
                      ? '0'
                      : `${(settingLinks.length + 1 - i) * 56}px`
                  })`,
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
                  <LinkItem link={link} position='right' />
                </NavLink>
              </li>
            ))}
            <li
              className={`transition-all duration-300 ease-in-out group ${baseClasses} ${inactiveClasses} ${
                isSettingsOpen
                  ? 'opacity-100'
                  : 'translate-y-[56px] opacity-0 pointer-events-none'
              }`}
            >
              <LinkItem
                link={{
                  to: '/',
                  label: 'Log out',
                  icon: <IoIosLogOut className='text-xl' />,
                }}
                position='right'
              />
            </li>

            <li
              key='profile'
              className='relative group/profile'
              ref={profileRef}
            >
              <NavLink
                to={profileLink.to}
                className={({ isActive }) => {
                  return `group ${baseClasses} ${
                    isActive ? activeClasses : inactiveClasses
                  }`;
                }}
              >
                <LinkItem link={profileLink} position='bottom' />
              </NavLink>
              <div
                className={`absolute group top-3 right-2 cursor-pointer text-2xl text-customBlack-light/30 dark:text-customWhite/40 dark:hover:text-customWhite/60 ${
                  sidebarState === 1 && 'translate-x-7'
                }`}
              >
                <BsThreeDotsVertical
                  className='opacity-0 group-hover/profile:opacity-100 transition-all duration-300'
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                />
                <Tooltip label='More settings' position='right-tight' />
              </div>
            </li>
          </ul>
        </div>
      )}

      {/* Divider */}
      <div
        className={`w-2 cursor-col-resize bg-customBlack-light/[.03] dark:bg-customBlack-light/95`}
        onMouseDown={handleMouseDown}
      />

      {/* Right column */}
      <div className='px-6 py-10 flex-grow bg-customBlack-light/[.03] dark:bg-customBlack-light/95 relative'>
        {/* Collapse/expand icons */}
        <div
          className={`absolute top-1/2 -left-[26px] flex flex-row cursor-pointer text-customWhite/40 text-xl ${
            isHovering ? 'opacity-100' : 'opacity-0'
          } transition-all duration-300`}
        >
          <div className='group relative'>
            <FaCaretLeft
              onClick={
                sidebarState === 1
                  ? () => setSidebarState(0)
                  : () => setSidebarState(1)
              }
              className='hover:-translate-x-0.5 transition-all duration-300'
            />
            <Tooltip
              label={
                sidebarState === 1
                  ? 'Hide sidebar'
                  : sidebarState === 2
                  ? 'Collapse sidebar'
                  : ''
              }
              position='bottom'
            />
          </div>

          <div className='group relative'>
            <FaCaretRight
              onClick={
                sidebarState === 0
                  ? () => setSidebarState(1)
                  : sidebarState === 1
                  ? () => setSidebarState(2)
                  : () => {}
              }
              className={`hover:translate-x-0.5 transition-all duration-300 -ml-1 ${
                sidebarState === 2 && 'hidden'
              }`}
            />
            <Tooltip
              label={
                sidebarState === 1
                  ? 'Expand sidebar'
                  : sidebarState === 0
                  ? 'Show sidebar'
                  : ''
              }
              position={sidebarState !== 0 ? 'bottom' : 'right-tight'}
            />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default HomeSidebar;
