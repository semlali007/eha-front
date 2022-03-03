export const environment = {
  production:false,
  appVersion: require('../../package.json').version,
  encryptionHead: '$ANSIBLE_VAULT;1.1;AES256\n',
  configPath: '/assets/config-dev.json'
};
