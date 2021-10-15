export const environment = {
  production: true,
  api: {
    auth: {
      baseURL: '/api-v2/public/index.php?url='
    },
    dataStore: {
      baseURL: '/api-v2/public/index.php?url='
    }
  },
  sso: {
        issuer: 'https://rec-websso-gardian.myelectricnetwork.com:443/gardianwebsso/oauth2/multiauth/PKCE',
        clientId: '5CEHA002',  // The "Auth Code + PKCE" client
        redirectUri: 'https://dsp0995466.atlas.edf.fr:5000',
        postLogoutRedirectUri: 'https://dsp0995466.atlas.edf.fr:5000',
        dummyClientSecret:'eB?7csn7Wo?+',
      } 
};
