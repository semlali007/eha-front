export const environment = {
  production: true,
  environmentName: 'production',
  api: {
    auth: {
      baseURL: '/eha-back/src'
    },
    dataStore: {
      baseURL: '/eha-back/src'
    }
  },
  sso: {
    issuer: 'https://rec-websso-gardian.myelectricnetwork.com:443/gardianwebsso/oauth2/multiauth/PKCE',
    clientId: '5CEHA002', // The "Auth Code + PKCE" client
    redirectUri: 'https://dsp0880728.atlas.edf.fr:5000',
    postLogoutRedirectUri: 'https://dsp0880728.atlas.edf.fr:5000',
    dummyClientSecret:'eB?7csn7Wo?+',
  }
};