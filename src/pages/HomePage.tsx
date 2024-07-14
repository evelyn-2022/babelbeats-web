import React from 'react';
import Navbar from '../components/layout/Navbar';

const HomePage: React.FC = () => {
  return (
    <div className='min-h-screen flex flex-col items-center w-full'>
      <Navbar />
      <div className='flex flex-grow flex-col gap-10 items-center justify-center w-full'>
        <div className='flex flex-col gap-10 text-4xl font-bold items-center'>
          <div>Your Music, Any Language</div>
          <div>All in One App</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
