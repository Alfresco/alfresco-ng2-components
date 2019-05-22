// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

require('dotenv').config( { path: './e2e/.env.cloud' });
const fs = require('fs');

const BPM_HOST = process.env.BPM_HOST || "bpm";
const OAUTH_HOST = process.env.OAUTH_HOST || "keycloak";
const IDENTITY_HOST = process.env.IDENTITY_HOST || "identity";
const OAUTH_CLIENDID = process.env.OAUTH_CLIENDID || "clientId";
const AUTH_TYPE = process.env.AUTH_TYPE || "clientId";
const PROVIDERS = process.env.PROVIDERS || "BPM";

fs.readFile('./demo-shell/dist/app.config.json', (err, appConfigString) => {
    if (err) throw err;
    let appConfig = JSON.parse(appConfigString);
    appConfig.bpmHost = BPM_HOST;
    appConfig.authType = AUTH_TYPE;
    appConfig.providers = PROVIDERS;
    appConfig.identityHost = IDENTITY_HOST;
    appConfig.oauth2.host = OAUTH_HOST;
    appConfig.oauth2.clientId = OAUTH_CLIENDID;

    let appConfigReplacedJson = JSON.stringify(appConfig);
    fs.writeFileSync('./demo-shell/dist/app.config.json', appConfigReplacedJson);
});
