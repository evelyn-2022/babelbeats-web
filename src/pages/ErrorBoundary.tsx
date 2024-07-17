import React from 'react';
import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { wave } from '../assets';

const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  let errorStatus, errorText;

  if (error && isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorStatus = '404 - Page Not Found';
      errorText = 'Sorry, the page you are looking for does not exist.';
    } else {
      errorStatus = `Error ${error.status}`;
      errorText = error.statusText;
    }
  } else {
    errorStatus = 'Unexpected Error';
    errorText = 'Sorry, an unexpected error occurred.';
  }

  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen gap-8'>
      <Helmet>
        <title>BabelBeats | Error</title>
      </Helmet>
      <div className='flex flex-row items-center gap-1.5'>
        <div className='rounded-full bg-primary p-1'>
          <img src={wave} className='w-6 h-6' alt='Wave' />
        </div>
        <div className='font-sans font-bold text-lg'>BabelBeats</div>
      </div>
      <h1 className='text-4xl font-bold'>{errorStatus}</h1>
      <p className='text-sm text-customBlack-light/70 dark:text-customWhite/70'>
        {errorText}
      </p>

      <Link to='/' className='link'>
        Go to Home
      </Link>
    </div>
  );
};

export default ErrorBoundary;
