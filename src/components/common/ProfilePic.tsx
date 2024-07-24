import React from 'react';
import { useAuth } from '../../context';

const ProfilePic: React.FC<{ width: string }> = ({ width }) => {
  const { authState } = useAuth();

  return (
    <>
      {authState.user?.profilePic ? (
        <>
          <img
            src={authState.user.profilePic}
            alt='profile picture'
            className={`rounded-full w-${width}`}
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.display = 'none';
              if (target.nextSibling) {
                (target.nextSibling as HTMLElement).style.display = 'flex';
              }
            }}
            style={{
              display: authState.user.profilePic ? 'block' : 'none',
            }}
          />
          <div
            className={`flex items-center justify-center w-${width} h-${width} bg-gray-500 text-white rounded-full text-xl font-bold`}
            style={{ display: 'none' }}
          >
            {authState.user.name.charAt(0)}
          </div>
        </>
      ) : (
        <div
          className={`flex items-center justify-center w-${width} h-${width} bg-gray-500 text-white rounded-full text-xl font-bold`}
        >
          {authState.user?.name.charAt(0)}
        </div>
      )}
    </>
  );
};

export default ProfilePic;
