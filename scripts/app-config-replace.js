// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

require('dotenv').config({path: process.env.ENV_FILE});
const fs = require('fs');

const configPath = './dist/demo-shell/app.config.json';

fs.readFile(configPath, (err, appConfigString) => {
    if (err) throw err;
    let appConfig = JSON.parse(appConfigString);
    appConfig.providers = process.env.PROVIDERS || 'ALL';
    appConfig.bpmHost = (process.env.PROXY_HOST_ADF || process.env.URL_HOST_ADF);
    appConfig.ecmHost = (process.env.PROXY_HOST_ADF || process.env.URL_HOST_ADF);
    appConfig.identityHost = (process.env.HOST_SSO + '/auth/admin/realms/alfresco');
    appConfig.oauth2.host = (process.env.HOST_SSO + '/auth/realms/alfresco');
    appConfig.notificationDefaultDuration = process.env.NOTIFICATION_LAST || 8000;
    appConfig.authType = process.env.AUTH_TYPE || 'BASIC';

    let appConfigReplacedJson = JSON.stringify(appConfig,null,4);


    fs.writeFileSync(configPath, appConfigReplacedJson);
});
