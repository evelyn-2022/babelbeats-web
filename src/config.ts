const config = {
  region: 'us-east-1',
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  userPoolWebClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
  oauth: {
    domain: import.meta.env.VITE_COGNITO_DOMAIN,
    redirectSignIn: import.meta.env.VITE_REDIRECT_SIGNIN,
    redirectSignOut: import.meta.env.VITE_REDIRECT_SIGNOUT,
    scope: ['openid', 'profile', 'email'],
  },
  credentials: {
    accessKeyId: import.meta.env.VITE_COGNITO_ADMIN_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_COGNITO_ADMIN_SECRET_ACCESS_KEY || '',
  },
  REACT_APP_API_URL: import.meta.env.VITE_API_URL,
  GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
};

export default config;
