// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    api: {
      auth: {
        baseURL: '/api'
      },
      dataStore: {
        baseURL: '/api'
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
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.