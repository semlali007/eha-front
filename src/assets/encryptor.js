const { Vault } = require('ansible-vault');
const fs = require('fs');
const appConfigFilePath = 'src/assets/config-dev.json';
console.log(process.env);
/*const appConfig = fs.readFileSync(appConfigFilePath, 'utf8');
const v = new Vault({ password: 'qqq' })
//const v = new Vault(appConfig)
v.encrypt(appConfig).then(result => {
 // console.log(result);
  //console.log(JSON.stringify(result));
    fs.writeFileSync('src/assets/config.json', result);
  }
)*/
