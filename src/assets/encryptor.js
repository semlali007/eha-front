const { Vault } = require('ansible-vault');
const fs = require('fs');
const appConfigFilePath = 'src/assets/config-dev.json';
const appConfig = fs.readFileSync(appConfigFilePath, 'utf8');
const v = new Vault({ password: 'qqq' })
//const v = new Vault(appConfig)
v.encrypt(appConfig).then(result => {
    let lines = result.split('\n');
// remove one line, starting at the first position
    lines.splice(0,1);
// join the array back into a single string
    let newText = lines.join('\n');
    fs.writeFileSync('src/assets/e_config-dev.json', newText);
  }
)
