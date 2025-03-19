import { OAuthModuleConfig } from 'angular-oauth2-oidc';

export const authModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: ['https://demo.identityserver1111.io/api'],
    sendAccessToken: true,
  }
};
