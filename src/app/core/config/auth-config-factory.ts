
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { AuthConfig } from 'angular-oauth2-oidc';
export function authConfigFactory(appConfig: AppConfigService): AuthConfig {
  return {
    issuer: appConfig.config.sso.issuer,
    clientId: appConfig.config.sso.clientId, // The "Auth Code + PKCE" client
    responseType: 'code',
    redirectUri: appConfig.config.sso.redirectUri,
    postLogoutRedirectUri: appConfig.config.sso.postLogoutRedirectUri,
    scope: 'gardianSesameProfil mail gardianSesameDroit openid gardianGroupID givenName cn uid employeeType gardianHierarchie departmentNumber name isMemberOf sn email', // Ask offline_access to support refresh token refreshes
    useSilentRefresh: false, // Needed for Code Flow to suggest using iframe-based refreshes
    timeoutFactor: 0.25, // For faster testing
    sessionChecksEnabled: true,
    showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
    clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
    dummyClientSecret: appConfig.config.sso.dummyClientSecret,
    useHttpBasicAuth: true
  };
}