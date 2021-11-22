// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: require('../../package.json').version + '-dev',
  configPath: '/assets/config-dev.json'
};
/*
 * For easier debugging in development mode, you can import the following file
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
