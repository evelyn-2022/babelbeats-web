import React from 'react';
import { Outlet } from 'react-router-dom';

const HomeSidebar: React.FC = () => {
  return (
    <div className='min-h-screen flex flex-col items-center w-full'>
      <div className='flex flex-grow w-full'>
        {/* Left Column */}
        <div className='w-3/12 pl-14 pr-6 py-8 flex flex-col flex-grow gap-8'>
          Left column
        </div>

        {/* Right Column */}
        <div className='w-9/12 pl-6 pr-14 py-8 flex-grow bg-customBlack-light/[.03] dark:bg-customBlack-light/95'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomeSidebar;
