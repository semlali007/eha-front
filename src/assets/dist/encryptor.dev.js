"use strict";

var _require = require('ansible-vault'),
    Vault = _require.Vault;

var fs = require('fs');

var appConfigFilePath = 'src/assets/config-dev.json';
var appConfig = fs.readFileSync(appConfigFilePath, 'utf8');
var v = new Vault({
  password: 'qqq'
}); //const v = new Vault(appConfig)

v.encrypt(appConfig).then(function (result) {
  var lines = result.split('\n'); // remove one line, starting at the first position

  lines.splice(0, 1); // join the array back into a single string

  var newText = lines.join('\n');
  fs.writeFileSync('src/assets/e_config.json', newText);
});