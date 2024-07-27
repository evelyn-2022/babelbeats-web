const config = {
  region: 'us-east-1',
  userPoolId: 'us-east-1_0kuoayjWa',
  userPoolWebClientId: '4jod8tp3oom6qbikj7or7g1fdb',
  oauth: {
    domain: 'babelbeats.auth.us-east-1.amazoncognito.com',
    redirectSignIn: 'https://localhost:3000/oauth2/callback',
    redirectSignOut: 'https://localhost:3000/',
    scope: ['openid', 'profile', 'email'],
  },
  credentials: {
    accessKeyId: import.meta.env.VITE_COGNITO_ADMIN_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_COGNITO_ADMIN_SECRET_ACCESS_KEY || '',
  },
  REACT_APP_API_URL: 'https://localhost:8080/api/',
};

export default config;
