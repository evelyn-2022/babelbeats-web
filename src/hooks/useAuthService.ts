import { useNavigate } from 'react-router-dom';
import { useAuth, useError } from '../context';
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
  const { addError } = useError();

  const handleSignUp = async (
    email: string,
    password: string,
    username: string
  ) => {
    changeAuthState({ loading: true });

    try {
      await signUp(email, password, username);
      changeAuthState({ loading: false });
      sessionStorage.setItem('emailForConfirmation', email);
      navigate('/signup-confirm');
    } catch (error) {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An unknown error occurred while signing up';
      }
      addError({
        message: errorMessage,
        displayType: 'toast',
        category: 'auth',
      });
      changeAuthState({
        loading: false,
      });
    }
  };

  const handleConfirmSignUp = async (code: string) => {
    changeAuthState({ loading: true });

    const email = sessionStorage.getItem('emailForConfirmation');
    if (!email) {
      changeAuthState({
        loading: false,
      });
      return;
    }
    try {
      await confirmSignUp(email, code);
      changeAuthState({ loading: false });
      sessionStorage.removeItem('emailForConfirmation');
      navigate('/login');
    } catch (error) {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An unknown error occurred while confirming sign up';
      }
      addError({
        message: errorMessage,
        displayType: 'toast',
        category: 'auth',
      });
      changeAuthState({ loading: false });
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
      // If user info is not in the database, update it
      if (!userInfo.id) {
        const updatedUser = await updateUser(userInfo);
        changeAuthState({ user: updatedUser });
      }
      navigate('/');
    } catch (error) {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An unknown error occurred while signing in';
      }
      throw new Error(errorMessage);
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
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An unknown error occurred while signing in';
      }
      addError({
        message: errorMessage,
        displayType: 'toast',
        category: 'auth',
      });
      changeAuthState({ loading: false });
    }
  };

  const handleGoogleSignInCallback = async (authorizationCode: string) => {
    changeAuthState({ loading: true });
    try {
      const tokens = await exchangeCodeForTokens(authorizationCode);
      if (tokens) {
        await storeTokens(
          tokens.id_token,
          tokens.access_token,
          tokens.refresh_token
        );
        await processSignIn(tokens.id_token);
      } else {
        throw new Error('Failed to exchange code for tokens');
      }
    } catch (error) {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An unknown error occurred while signing in';
      }
      addError({
        message: errorMessage,
        displayType: 'toast',
        category: 'auth',
      });
      changeAuthState({ loading: false });
    }
  };

  const handleSignOut = () => {
    removeTokens();
    sessionStorage.removeItem('authState');
    setAuthState({
      user: null,
      isAuthenticated: false,
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
