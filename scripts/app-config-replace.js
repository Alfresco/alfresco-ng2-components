// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

require('dotenv').config({ path: process.env.ENV_FILE });
const fs = require('fs');

const API_HOST = process.env.API_HOST || "bpm";
const OAUTH_HOST = process.env.OAUTH_HOST || "keycloak";
const IDENTITY_HOST = process.env.IDENTITY_HOST || "identity";
const NOTIFICATION_LAST = process.env.NOTIFICATION_LAST || 8000;

const configPath = './demo-shell/dist/app.config.json';

fs.readFile(configPath, (err, appConfigString) => {
    if (err) throw err;
    let appConfig = JSON.parse(appConfigString);
    appConfig.oauth2.host = API_HOST;
    appConfig.apiHost = API_HOST;
    appConfig.bpmHost = API_HOST;
    appConfig.identityHost = IDENTITY_HOST;
    appConfig.oauth2.host = OAUTH_HOST;
    appConfig.notificationDefaultDuration = NOTIFICATION_LAST;

    let appConfigReplacedJson = JSON.stringify(appConfig);
    fs.writeFileSync(configPath, appConfigReplacedJson);
});
