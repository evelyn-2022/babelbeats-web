import { createBrowserRouter } from 'react-router-dom';
import { ProviderWrapper } from './context';
import {
  ProductLandingPage,
  GetStartedPage,
  LoginPage,
  SignupPage,
  SignupConfirmPage,
  OAuthCallbackPage,
  ForgotPasswordPage,
  VerifyPasswordResetPage,
  ResetPasswordPage,
  AccountSidebar,
  ProfilePage,
  AccountPage,
  SettingsPage,
  LanguagePage,
  ErrorBoundary,
  ProtectedRoute,
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
      { path: '/', element: <ProductLandingPage /> },
      { path: '/get-started', element: <GetStartedPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/signup-confirm', element: <SignupConfirmPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/verify-password-reset', element: <VerifyPasswordResetPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/oauth2/callback', element: <OAuthCallbackPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/me', element: <ProfilePage /> },
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
]);

export default router;
