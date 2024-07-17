import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
  AdminGetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import axios, { AxiosResponse } from 'axios';
import config from '../config';
import { Token } from '../types';

const userPool = new CognitoUserPool({
  UserPoolId: config.userPoolId,
  ClientId: config.userPoolWebClientId,
});

const { accessKeyId, secretAccessKey } = config.credentials;
const cognitoClient = new CognitoIdentityProviderClient({
  region: config.region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const {
  oauth: { domain, redirectSignIn },
  userPoolWebClientId: clientId,
} = config;

export const signUp = (email: string, password: string, username: string) => {
  const attributeList = [
    new CognitoUserAttribute({
      Name: 'email',
      Value: email,
    }),
    new CognitoUserAttribute({
      Name: 'name',
      Value: username,
    }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const confirmSignUp = (
  email: string,
  code: string
): Promise<'SUCCESS' | Error> => {
  const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

export const signIn = (
  email: string,
  password: string
): Promise<CognitoUserSession> => {
  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result: CognitoUserSession) => {
        resolve(result);
      },
      onFailure: (err: Error) => {
        reject(err);
      },
    });
  });
};

export const googleSignIn = () => {
  const redirectUri = encodeURIComponent(redirectSignIn);
  const url = `https://${domain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&identity_provider=Google`;
  window.location.assign(url);
};

export const exchangeCodeForTokens = async (
  authorizationCode: string
): Promise<Token | null> => {
  const tokenEndpoint = `https://${domain}/oauth2/token`;
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', clientId);
  params.append('code', authorizationCode);
  params.append('redirect_uri', redirectSignIn);

  try {
    const response: AxiosResponse = await axios.post(tokenEndpoint, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status === 200) {
      console.log('Token exchange successful:', response.data);
      return response.data as Token;
    } else {
      console.error('Failed to exchange code for tokens:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Failed to exchange code for tokens:', error);
    return null;
  }
};

export const refreshTokens = async (refreshToken: string) => {
  const tokenEndpoint = `https://${domain}/oauth2/token`;
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('client_id', clientId);
  params.append('refresh_token', refreshToken);

  try {
    const response = await axios.post(tokenEndpoint, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to refresh tokens');
    }

    const data = response.data;
    return {
      idToken: data.id_token,
      accessToken: data.access_token,
    };
  } catch (error) {
    console.error('Failed to refresh tokens:', error);
    return null;
  }
};

export const resendConfirmationCode = async (email: string): Promise<void> => {
  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode(err => {
      if (err) {
        reject(
          new Error('Error resending confirmation code. Please try again later')
        );
      } else {
        resolve();
      }
    });
  });
};

export const forgotPassword = async (email: string): Promise<void> => {
  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    // First, check if the user exists
    const params = {
      UserPoolId: config.userPoolId,
      Username: email,
    };

    const command = new AdminGetUserCommand(params);

    cognitoClient
      .send(command)
      .then(() => {
        // If user exists, proceed with forgot password
        cognitoUser.forgotPassword({
          onSuccess: () => {
            sessionStorage.setItem('email-reseting', email);
            resolve();
          },
          onFailure: err => {
            reject(err);
          },
        });
      })
      .catch(err => {
        if (err.name === 'UserNotFoundException') {
          reject(new Error('Email not registered'));
        } else {
          reject(err);
        }
      });
  });
};

export const resetPassword = async (
  verificationCode: string,
  newPassword: string
): Promise<void> => {
  const email = sessionStorage.getItem('email-reseting');

  if (!email) return;

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: () => {
        alert('Password reset successfully');
        resolve();
      },
      onFailure: err => {
        alert('Error resetting password');
        reject(err);
      },
    });
  });
};

export const updateCognitoUserIdAttribute = async (
  username: string,
  customId: string
) => {
  try {
    const params = {
      UserPoolId: config.userPoolId,
      Username: username,
      UserAttributes: [
        {
          Name: 'custom:id',
          Value: customId.toString(),
        },
      ],
    };

    const command = new AdminUpdateUserAttributesCommand(params);
    const response = await cognitoClient.send(command);
    console.log('Successfully updated custom:id attribute:', response);
  } catch (error) {
    console.error(
      'Error updating custom:id attribute:',
      error,
      accessKeyId,
      secretAccessKey
    );
  }
};
