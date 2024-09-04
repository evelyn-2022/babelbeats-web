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
  AccountPage,
  SettingsPage,
  HomePage,
  ProfilePage,
  PlaylistsPage,
  CollectionsPage,
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
                  { path: 'settings', element: <SettingsPage /> },
                  { path: 'playlists', element: <PlaylistsPage /> },
                  { path: 'collections', element: <CollectionsPage /> },
                  { path: 'settings', element: <SettingsPage /> },
                  { path: 'profile', element: <ProfilePage /> },
                  { path: 'account', element: <AccountPage /> },
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
      {
        path: '/oauth2/google/callback',
        element: <OAuthCallbackPage provider='google' />,
      },
      {
        path: '/oauth2/spotify/callback',
        element: <OAuthCallbackPage provider='spotify' />,
      },
    ],
  },
]);

export default router;
