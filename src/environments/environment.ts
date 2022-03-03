export const environment = {
  production:false,
  appVersion: require('../../package.json').version,
  encryptionKey: 'qqq',
  encryptionHead: '$ANSIBLE_VAULT;1.1;AES256\n',
  configPath: '/assets/e_config-dev.json'
};
