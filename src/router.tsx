import { createBrowserRouter } from 'react-router-dom';
import { ProviderWrapper } from './context';
import {
  RootPage,
  GetStartedPage,
  LoginPage,
  SignupPage,
  SignupConfirmPage,
  OAuthCallbackPage,
  ForgotPasswordPage,
  VerifyPasswordResetPage,
  ResetPasswordPage,
  AccountSidebar,
  AccountPage,
  SettingsPage,
  LanguagePage,
  HomePage,
  ProfilePage,
  ErrorBoundary,
  ProtectedRoute,
  HomeSidebar,
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
      {
        path: '/',
        element: <RootPage />,
        children: [
          {
            element: <ProtectedRoute />,
            children: [
              {
                path: '/',
                element: <HomeSidebar />,
                children: [
                  { path: '', element: <HomePage /> },
                  { path: 'profile', element: <ProfilePage /> },
                ],
              },
              {
                path: '/account',
                element: <AccountSidebar />,
                children: [
                  { path: 'account', element: <AccountPage /> },
                  { path: 'language', element: <LanguagePage /> },
                  { path: 'settings', element: <SettingsPage /> },
                ],
              },
            ],
          },
        ],
      },
      { path: '/get-started', element: <GetStartedPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/signup-confirm', element: <SignupConfirmPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/verify-password-reset', element: <VerifyPasswordResetPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/oauth2/callback', element: <OAuthCallbackPage /> },
    ],
  },
]);

export default router;
