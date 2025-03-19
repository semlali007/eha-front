export const environment = {
  production: true,
  appVersion: require('../../package.json').version,
  encryptionHead: '$ANSIBLE_VAULT;1.1;AES256\n',
  configPath: '/assets/e_config.json',
  maxuploadsize: 20000000
};
