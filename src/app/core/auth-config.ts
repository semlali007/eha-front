import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: null,
  clientId: null, // The "Auth Code + PKCE" client
  responseType: 'code',
  redirectUri: null,
  postLogoutRedirectUri: null,
  scope: 'gardianSesameProfil mail gardianSesameDroit openid gardianGroupID givenName cn uid employeeType gardianHierarchie departmentNumber name isMemberOf sn email', // Ask offline_access to support refresh token refreshes
  useSilentRefresh: false, // Needed for Code Flow to suggest using iframe-based refreshes
  timeoutFactor: 0.25, // For faster testing
  sessionChecksEnabled: true,
  showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
  clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
  dummyClientSecret: null,
  useHttpBasicAuth: true
};