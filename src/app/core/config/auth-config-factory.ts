
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Vault} from 'ansible-vault';
export function getAuthConfig(http: HttpClient, oAuthService: OAuthService, configService: AppConfigService): (() => Promise<void>) {
  return (): Promise<void> => {
    return new Promise<void>((resolve) => {
      const url = `${environment.configPath}`;
      http.get(url)
    .subscribe((config: any) => {
      const vault = new Vault({ password: environment.encryptionKey });
      vault.decrypt(config.data).then(dataResponse=>{
       const data = JSON.parse(dataResponse);
       const cfg = {
         issuer: data.authConfig.issuer,
         clientId: data.authConfig.clientId, // The "Auth Code + PKCE" client
         responseType: 'code',
         redirectUri: data.authConfig.redirectUri,
         postLogoutRedirectUri: data.authConfig.postLogoutRedirectUri,
         scope: 'openid gardianSesameProfil mail gardianSesameDroit gardianGroupID givenName cn uid employeeType gardianHierarchie departmentNumber name isMemberOf sn email', // Ask offline_access to support refresh token refreshes
         useSilentRefresh: false, // Needed for Code Flow to suggest using iframe-based refreshes
         timeoutFactor: 0.25, // For faster testing
         sessionChecksEnabled: true,
         showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
         clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
         dummyClientSecret: data.authConfig.dummyClientSecret,
         useHttpBasicAuth: true,
         nonceStateSeparator: '-'
       } as AuthConfig;

       oAuthService.configure(cfg);
       configService.appConfig = data.appConfig;
       configService.authConfig = data.authConfig;
       resolve();

      });
      });
    });
  };
}
