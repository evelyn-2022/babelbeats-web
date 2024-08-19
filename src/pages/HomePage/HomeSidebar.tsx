import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BiHomeAlt2 } from 'react-icons/bi';
import { BsCollection, BsThreeDotsVertical } from 'react-icons/bs';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { LuSearch } from 'react-icons/lu';
import { PiPlaylist } from 'react-icons/pi';
import { GoPerson } from 'react-icons/go';
import { LuSettings } from 'react-icons/lu';
import { IoIosLogOut } from 'react-icons/io';
import { ProfilePic, Tooltip, YtbMusicPlayer } from '../../components';
import { useAuth } from '../../context';
import { useAuthService } from '../../hooks';

const HomeSidebar: React.FC = () => {
  const { authState } = useAuth();
  const { handleSignOut } = useAuthService();
  const [sidebarState, setSidebarState] = useState(1); // 0: hidden, 1: collapsed, 2: full
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showDivider, setShowDivider] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showThreeDots, setShowThreeDots] = useState(false);
  const settingsRef = useRef<HTMLUListElement>(null);
  const profileRef = useRef<HTMLLIElement>(null);
  const startPosition = useRef(0); // To store the initial mouse down position
  const threshold = 30; // px

  const handleMouseDown = (event: React.MouseEvent) => {
    startPosition.current = event.clientX;
    document.addEventListener('mousemove', handleMouseDrag);
    document.addEventListener('mouseup', handleMouseUp);
  };

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
    document.removeEventListener('mousemove', handleMouseDrag);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setShowDivider(!showDivider);
    startPosition.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setIsDragging(true);
    const currentTouchPosition = e.touches[0].clientX;
    const distanceMoved = currentTouchPosition - startPosition.current;

    if (Math.abs(distanceMoved) >= threshold) {
      setIsDragging(true);
      if (distanceMoved > 0) {
        // Touch moved to the right
        setSidebarState(prev => (prev < 2 ? prev + 1 : 2));
      } else if (distanceMoved < 0) {
        // Touch moved to the left
        setSidebarState(prev => (prev > 0 ? prev - 1 : 0));
      }
      startPosition.current = currentTouchPosition; // Reset start position after state change
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Exit full screen mode when hit 'Escape' key
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setSidebarState(1);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
        setShowThreeDots(false);
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
      icon: (
        <BiHomeAlt2 className='text-lg xl:text-[1.3rem] xl:-mr-[0.05rem]' />
      ),
    },
    {
      to: '/search',
      label: 'Search',
      icon: <LuSearch className='text-lg xl:text-xl' />,
    },
    {
      to: '/collections',
      label: 'Collections',
      icon: <BsCollection className='text-md xl:text-lg' />,
    },
    {
      to: '/playlists',
      label: 'Playlists',
      icon: <PiPlaylist className='text-xl xl:text-2xl xl:-ml-0.5 xl:-mr-1' />,
    },
  ];

  const settingLinks: Link[] = [
    {
      to: '/account',
      label: 'Account',
      icon: <GoPerson className='text-lg xl:text-xl' />,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: <LuSettings className='text-lg xl:text-xl' />,
    },
  ];

  const profileLink: Link = {
    to: '/profile',
    label: authState.user?.name.split(' ')[0],
    icon: (
      <div className={`${sidebarState !== 1 && '-ml-2 -mr-1'} w-6 xl:w-8`}>
        <ProfilePic width='w-6 xl:w-8' height='h-6 xl:h-8' />
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

  const baseClasses = `p-3 rounded-full flex items-center justify-center mb-2 relative ${
    sidebarState === 2 ? 'h-9 xl:h-12 ' : 'h-9 w-9 xl:h-12 xl:w-12'
  }`;
  const activeClasses =
    'bg-customBlack-light/[.03] dark:text-primary dark:bg-customBlack-lighter';
  const inactiveClasses =
    'hover:bg-customBlack-light/5 dark:hover:bg-customBlack-light';

  return (
    <div className='min-h-screen flex w-full'>
      {/* Left column */}
      {sidebarState !== 0 && (
        <div
          className={`fixed left-0 h-full ${
            sidebarState === 1 ? 'w-[8%] xl:w-[6.7%]' : 'w-[19%] xl:w-[14%]'
          } transition-all duration-300 px-6 py-10 flex flex-col justify-between z-30`}
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
              className={`transition-all duration-300 ease-in-out group cursor-pointer ${baseClasses} ${inactiveClasses} ${
                isSettingsOpen
                  ? 'opacity-100'
                  : 'translate-y-[56px] opacity-0 pointer-events-none'
              }`}
              onClick={handleSignOut}
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
              onTouchStart={() => {
                setShowThreeDots(!showThreeDots);
              }}
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
                className={`absolute group top-1.5 xl:top-3 right-1 cursor-pointer text-2xl text-customBlack-light/30 dark:text-customWhite/40 dark:hover:text-customWhite/60 ${
                  sidebarState === 1 && 'translate-x-7'
                }`}
              >
                <BsThreeDotsVertical
                  className={`opacity-0 group-hover/profile:opacity-100 transition-all duration-300 ${
                    showThreeDots && 'opacity-100'
                  }`}
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                />
                <Tooltip label='More settings' position='right-tight' />
              </div>
            </li>
          </ul>
        </div>
      )}

      {/* Right column */}
      <div
        className={`px-6 py-10 h-fit min-h-screen flex-grow bg-customBlack-light/[.03] dark:bg-customBlack-light/95 absolute right-0 ${
          sidebarState === 1
            ? 'w-[92%] xl:w-[93.3%]'
            : sidebarState === 0
            ? 'w-full'
            : 'w-[81%] xl:w-[86%]'
        } transition-all duration-300`}
      >
        <Outlet />
      </div>
      <div
        className={`fixed w-4 h-full -translate-x-2 cursor-col-resize top-0 z-50 bg-transparent ${
          sidebarState === 1
            ? 'lg:left-[8%] xl:left-[6.7%]'
            : sidebarState === 0
            ? 'left-0'
            : 'lg:left-[19%] xl:left-[14%]'
        } flex flex-row items-center text-customWhite/40 text-xl opacity-0 hover:opacity-100 transition-all duration-300 ${
          isDragging && 'opacity-100'
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Collapse icon */}
        <div className='group relative cursor-pointer -translate-x-3'>
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
        {/* Divider */}
        <div
          className={`w-0.5 h-full bg-transparent ${
            showDivider && 'bg-white/20'
          } ${isDragging && 'bg-white/50'}`}
        />
        {/* Expand icon */}
        <div className='group relative cursor-pointer -translate-x-3'>
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
            position={
              sidebarState === 2
                ? 'hidden'
                : sidebarState === 1
                ? 'bottom'
                : 'right-tight'
            }
          />
        </div>
      </div>

      {/* Music player */}
      <div
        className={`fixed bottom-0 right-0 w-full px-6 py-2 bg-customBlack/50 backdrop-blur-lg transition-all duration-300 ${
          sidebarState === 1
            ? 'lg:w-[92%] xl:w-[93.3%]'
            : sidebarState === 0
            ? 'w-full'
            : 'lg:w-[81%] xl:w-[86%]'
        }`}
      >
        <YtbMusicPlayer videoId='0Q7w7gk1JhQ' />
      </div>
    </div>
  );
};

export default HomeSidebar;
