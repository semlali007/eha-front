const { Vault } = require('ansible-vault');
const fs = require('fs');
const appConfigFilePath = 'src/assets/config-dev.json';

const appConfig = fs.readFileSync(appConfigFilePath, 'utf8');
const v = new Vault({ password: 'coucou' })
//const v = new Vault(appConfig)
v.encrypt(appConfig).then(result => {
    fs.writeFileSync('src/assets/config.json', JSON.stringify({ data: result }));
  }
)
