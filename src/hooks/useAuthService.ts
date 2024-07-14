import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import {
  signUp,
  confirmSignUp,
  signIn,
  googleSignIn,
  exchangeCodeForTokens,
  updateUser,
} from '../services';
import { storeTokens, removeTokens, extractUserInfo } from '../utils';

export const useAuthService = () => {
  const { setAuthState, changeAuthState } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (
    email: string,
    password: string,
    username: string
  ) => {
    changeAuthState({ loading: true });

    try {
      await signUp(email, password, username);
      changeAuthState({ loading: false });
      alert('Sign up successful! Please verify your email.');
      sessionStorage.setItem('emailForConfirmation', email);
      navigate('/signup-confirm');
    } catch (error) {
      changeAuthState({
        loading: false,
        error: { message: 'An unknow error occurred' } as Error,
      });
    }
  };

  const handleConfirmSignUp = async (code: string) => {
    changeAuthState({ loading: true });

    const email = sessionStorage.getItem('emailForConfirmation');
    if (!email) {
      changeAuthState({
        loading: false,
        error: {
          message: 'Email not found',
        } as Error,
      });
      return;
    }
    try {
      await confirmSignUp(email, code);

      changeAuthState({ loading: false });
      sessionStorage.removeItem('emailForConfirmation');
      navigate('/login');
    } catch (error) {
      changeAuthState({ loading: false, error: error as Error });
    }
  };

  const processSignIn = async (idToken: string) => {
    try {
      const userInfo = await extractUserInfo(idToken);
      changeAuthState({
        user: { ...userInfo },
        loading: false,
        isAuthenticated: true,
      });
      if (!userInfo.id) {
        const updatedUser = await updateUser(userInfo);
        changeAuthState({ user: updatedUser });
      }
      // navigate('/');
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const handleSignIn = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    changeAuthState({ loading: true });
    try {
      const result = await signIn(email, password);
      await storeTokens(
        result.getIdToken().getJwtToken(),
        result.getAccessToken().getJwtToken(),
        result.getRefreshToken().getToken(),
        rememberMe
      );
      await processSignIn(result.getIdToken().getJwtToken());
    } catch (error) {
      changeAuthState({ loading: false, error: error as Error });
    }
  };

  const handleGoogleSignInCallback = async (authorizationCode: string) => {
    changeAuthState({ loading: true });
    try {
      const tokens = await exchangeCodeForTokens(authorizationCode);
      console.log('tokens', tokens);
      if (tokens) {
        await storeTokens(
          tokens.id_token,
          tokens.access_token,
          tokens.refresh_token,
          true
        );
        await processSignIn(tokens.id_token);
      } else {
        throw new Error('Failed to exchange code for tokens');
      }
    } catch (error) {
      changeAuthState({
        loading: false,
        error: {
          message: 'An unexpected error occurred when signing in with Google',
        } as Error,
      });
    }
  };

  const handleSignOut = () => {
    removeTokens();
    sessionStorage.removeItem('authState');
    setAuthState({
      user: null,
      isAuthenticated: false,
      error: null,
      loading: false,
    });
    navigate('/');
  };

  return {
    handleSignUp,
    handleConfirmSignUp,
    handleSignIn,
    handleGoogleSignInCallback,
    handleSignOut,
    handleGoogleSignIn: googleSignIn,
    handleFBSignIn: () => {},
    handleAppleSignIn: () => {},
  };
};
