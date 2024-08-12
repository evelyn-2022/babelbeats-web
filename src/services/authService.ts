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
  VerifyUserAttributeCommand,
  ListUsersCommand,
  ChangePasswordCommand,
  DeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import axios, { AxiosResponse } from 'axios';
import config from '../config';
import { CognitoToken } from '../types';

const {
  region,
  userPoolId,
  userPoolWebClientId: clientId,
  oauth: { domain, redirectSignIn },
  credentials: { accessKeyId, secretAccessKey },
} = config;

const userPool = new CognitoUserPool({
  UserPoolId: userPoolId,
  ClientId: clientId,
});

const cognitoClient = new CognitoIdentityProviderClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

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
): Promise<CognitoToken> => {
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
      const cognitoToken: CognitoToken = {
        idToken: response.data.id_token,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };
      return cognitoToken;
    } else {
      throw new Error(`Failed to exchange code for tokens: ${response.status}`);
    }
  } catch (error) {
    throw new Error('Unknow error occurred while exchanging code for tokens');
  }
};

export const refreshCognitoTokens = async (
  refreshToken: string
): Promise<{ idToken: string; accessToken: string }> => {
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

    return {
      idToken: response.data.id_token,
      accessToken: response.data.access_token,
    };
  } catch (error) {
    throw new Error('Failed to refresh tokens');
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
      onSuccess: () => resolve(),
      onFailure: err => reject(err),
    });
  });
};

export const updateCognitoUserIdAttribute = async (
  username: string,
  customId: string
) => {
  try {
    const params = {
      UserPoolId: userPoolId,
      Username: username,
      UserAttributes: [
        {
          Name: 'custom:id',
          Value: customId.toString(),
        },
      ],
    };

    const command = new AdminUpdateUserAttributesCommand(params);
    await cognitoClient.send(command);
  } catch (error) {
    throw new Error('Error updating custom:id attribute');
  }
};

export const checkEmailRegistered = async (email: string): Promise<boolean> => {
  try {
    const command = new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: `email = "${email}"`,
    });

    const response = await cognitoClient.send(command);

    if (response.Users && response.Users.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error('Failed to check if email is registered');
  }
};

export const updateCognitoUserEmail = async (
  username: string,
  newEmail: string
) => {
  try {
    const params = {
      UserPoolId: userPoolId,
      Username: username,
      UserAttributes: [
        {
          Name: 'email',
          Value: newEmail,
        },
        {
          Name: 'email_verified',
          Value: 'false',
        },
      ],
    };

    const command = new AdminUpdateUserAttributesCommand(params);
    await cognitoClient.send(command);
  } catch (error) {
    throw new Error('Failed to update email');
  }
};

export const verifyNewEmail = async (
  accessToken: string,
  verificationCode: string
) => {
  try {
    const params = {
      AccessToken: accessToken,
      AttributeName: 'email',
      Code: verificationCode,
    };

    const command = new VerifyUserAttributeCommand(params);
    await cognitoClient.send(command);
  } catch (error) {
    throw new Error('Failed to verify new email');
  }
};

export const verifyOldPassword = (
  email: string,
  oldPassword: string
): Promise<CognitoUser> => {
  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: oldPassword,
  });

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: () => {
        resolve(cognitoUser);
      },
      onFailure: (err: Error) => {
        reject(err);
      },
    });
  });
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  accessToken: string
): Promise<void> => {
  const command = new ChangePasswordCommand({
    AccessToken: accessToken,
    PreviousPassword: oldPassword,
    ProposedPassword: newPassword,
  });

  try {
    await cognitoClient.send(command);
  } catch (error) {
    throw new Error('Failed to change password');
  }
};

export const deleteCognitoUser = async (accessToken: string): Promise<void> => {
  const deleteUserCommand = new DeleteUserCommand({
    AccessToken: accessToken,
  });

  try {
    await cognitoClient.send(deleteUserCommand);
  } catch (error) {
    console.log(error);
    throw new Error('Failed to delete user:' + error);
  }
};
