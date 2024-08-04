import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';

const ProductLandingPage: React.FC = () => {
  return (
    <div className='min-h-screen flex flex-col items-center w-full container mx-auto px-4 xl:px-0'>
      <Helmet>
        <title>BabelBeats: All Your Music in One App</title>
      </Helmet>
      <Navbar />
      <div className='flex flex-grow flex-col items-center justify-center w-full'>
        <div className='flex flex-col gap-4 md:gap-10 text-2xl md:text-4xl font-bold items-center'>
          <div>Your Music, Any Language</div>
          <div>All in One App</div>
        </div>
      </div>
    </div>
  );
};

export default ProductLandingPage;
