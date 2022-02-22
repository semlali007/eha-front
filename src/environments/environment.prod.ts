export const environment = {
  production: true,
  appVersion: require('../../package.json').version,
  encryptionKey: '${process.env.encryptionKey}',//'qqq',
  encryptionHead: '$ANSIBLE_VAULT;1.1;AES256\n',
  configPath: '/assets/config.json'
};