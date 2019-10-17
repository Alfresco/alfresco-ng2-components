// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

require('dotenv').config({ path: process.env.ENV_FILE });
const fs = require('fs');

const PROXY_HOST_ADF = process.env.PROXY_HOST_ADF;
const NOTIFICATION_LAST = process.env.NOTIFICATION_LAST || 8000;

const configPath = './demo-shell/dist/app.config.json';

fs.readFile(configPath, (err, appConfigString) => {
    if (err) throw err;
    let appConfig = JSON.parse(appConfigString);
    appConfig.bpmHost = PROXY_HOST_ADF;
    appConfig.ecmHost = PROXY_HOST_ADF;
    appConfig.notificationDefaultDuration = NOTIFICATION_LAST;

    let appConfigReplacedJson = JSON.stringify(appConfig);
    fs.writeFileSync(configPath, appConfigReplacedJson);
});
