const config = {
  region: 'us-east-1',
  userPoolId: 'us-east-1_0kuoayjWa',
  userPoolWebClientId: '4jod8tp3oom6qbikj7or7g1fdb',
  oauth: {
    domain: 'babelbeats.auth.us-east-1.amazoncognito.com',
    redirectSignIn: 'http://localhost:5173/oauth2/callback',
    redirectSignOut: 'http://localhost:5173/',
    scope: ['openid', 'profile', 'email'],
  },
  REACT_APP_API_URL: 'http://localhost:8085/api/',
};

export default config;
