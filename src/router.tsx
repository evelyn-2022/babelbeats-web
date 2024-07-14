import { createBrowserRouter } from 'react-router-dom';

import { ProviderWrapper } from './context';
import {
  HomePage,
  GetStartedPage,
  LoginPage,
  SignupPage,
  SignupConfirmPage,
  OAuthCallbackPage,
  ErrorBoundary,
} from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProviderWrapper />,
    errorElement: (
      <ProviderWrapper>
        <ErrorBoundary />
      </ProviderWrapper>
    ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/get-started', element: <GetStartedPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/signup-confirm', element: <SignupConfirmPage /> },
      { path: '/oauth2/callback', element: <OAuthCallbackPage /> },
    ],
  },
]);

export default router;
