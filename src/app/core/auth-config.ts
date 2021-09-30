import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://rec-websso-gardian.myelectricnetwork.com:443/gardianwebsso/oauth2/multiauth/PKCE',
  clientId: '5CEHA002', // The "Auth Code + PKCE" client
  responseType: 'code',
  redirectUri: 'https://dsp0995466.atlas.edf.fr:5000',
  scope: 'gardianSesameProfil mail gardianSesameDroit openid gardianGroupID givenName cn uid employeeType gardianHierarchie departmentNumber name isMemberOf sn email', // Ask offline_access to support refresh token refreshes
  useSilentRefresh: false, // Needed for Code Flow to suggest using iframe-based refreshes
  timeoutFactor: 0.25, // For faster testing
  sessionChecksEnabled: true,
  showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
  clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
  dummyClientSecret:'eB?7csn7Wo?+',
  useHttpBasicAuth: true
};