import { useNavigate } from 'react-router-dom';
import { useAuth, useError } from '../context';
import {
  signUp,
  confirmSignUp,
  signIn,
  googleSignIn,
  exchangeCodeForTokens,
} from '../services';
import { useApiService } from './useApiService';
import { storeTokens, removeTokens, extractUserInfo } from '../utils';
import { CognitoToken } from '../types';

export const useAuthService = () => {
  const { authRequest, authSuccess, authFailure, setLoadingFalse } = useAuth();
  const { updateUserId } = useApiService();
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
      let userInfo = await extractUserInfo(idToken);
      // If user info is not in the database, update it
      if (!userInfo.id) {
        const updatedUserInfo = await updateUserId(userInfo);
        if (updatedUserInfo) {
          userInfo = updatedUserInfo;
        } else {
          throw new Error('Failed to update user info in database');
        }
      }
      authSuccess(userInfo);
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

      const cognitoToken: CognitoToken = {
        idToken: result.getIdToken().getJwtToken(),
        accessToken: result.getAccessToken().getJwtToken(),
        refreshToken: result.getRefreshToken().getToken(),
      };
      await storeTokens('CognitoToken', cognitoToken, rememberMe);
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
        const cognitoToken: CognitoToken = {
          idToken: tokens.idToken,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };

        await storeTokens('CognitoToken', cognitoToken);
        await processSignIn(tokens.idToken);
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
    removeTokens('CognitoToken');
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
