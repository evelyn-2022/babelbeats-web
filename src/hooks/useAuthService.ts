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
  const { authRequest, authSuccess, authFailure, setLoadingFalse } = useAuth();
  const navigate = useNavigate();
  const { addError } = useError();

  const handleSignUp = async (
    email: string,
    password: string,
    username: string
  ) => {
    authRequest();

    try {
      await signUp(email, password, username);
      setLoadingFalse();
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
      authFailure();
    }
  };

  const handleConfirmSignUp = async (code: string) => {
    authRequest();
    const email = sessionStorage.getItem('emailForConfirmation');
    if (!email) {
      authFailure();
      return;
    }
    try {
      await confirmSignUp(email, code);
      setLoadingFalse();
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
      authFailure();
    }
  };

  const processSignIn = async (idToken: string) => {
    try {
      const userInfo = await extractUserInfo(idToken);
      authSuccess(userInfo);
      // If user info is not in the database, update it
      if (!userInfo.id) {
        const updatedUser = await updateUser(userInfo);
        if (updatedUser) {
          authSuccess(updatedUser);
        } else {
          throw new Error('Failed to update user info in database');
        }
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
    authRequest();

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
      authFailure();
    }
  };

  const handleGoogleSignInCallback = async (authorizationCode: string) => {
    authRequest();
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
      authFailure();
    }
  };

  const handleSignOut = () => {
    removeTokens();
    authFailure();
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
