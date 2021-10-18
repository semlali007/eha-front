require('dotenv').config();
export const environment = {
  production: true,
  environmentName: 'production',
  api: {
    auth: {
      baseURL: '/api/'
    },
    dataStore: {
      baseURL: '/api/'
    }
  },
  sso: {
    issuer: '',
    clientId: '', // The "Auth Code + PKCE" client
    redirectUri: '',
    postLogoutRedirectUri: '',
    dummyClientSecret:'',
  }
};
