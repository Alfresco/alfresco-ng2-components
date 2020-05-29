/**
 * Contains the default app deployment settings
 * @class config.test.config
 */

require('dotenv').config({path: process.env.ENV_FILE});

const HOST = process.env.URL_HOST_ADF;

const LOG = process.env.LOG;

const ECM_HOST = process.env.PROXY_HOST_ADF || HOST || 'ecm';
const BPM_HOST = process.env.PROXY_HOST_ADF || HOST || 'bpm';

const PROVIDER = process.env.PROVIDER ? process.env.PROVIDER : 'BASIC';
const AUTH_TYPE = process.env.AUTH_TYPE ? process.env.AUTH_TYPE : 'OAUTH';

const OAUTH_HOST = process.env.HOST_SSO || process.env.PROXY_HOST_ADF || HOST || 'oauth';
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENDID || 'alfresco';

const IDENTITY_ADMIN_EMAIL = process.env.IDENTITY_ADMIN_EMAIL || "defaultadmin";
const IDENTITY_ADMIN_PASSWORD = process.env.IDENTITY_ADMIN_PASSWORD || "defaultadminpassword";

const HR_USER = process.env.HR_USER || "hruser";
const HR_USER_PASSWORD = process.env.HR_USER_PASSWORD || "defaulthruserpassword";

const USERNAME_ADF = process.env.USERNAME_ADF || "defaultuser";
const PASSWORD_ADF = process.env.PASSWORD_ADF || "defaultuserpassword";

const SCREENSHOT_URL = process.env.SCREENSHOT_URL || HOST;
const SCREENSHOT_PASSWORD = process.env.SCREENSHOT_PASSWORD || process.env.PASSWORD_ADF;
const SCREENSHOT_USERNAME = process.env.SCREENSHOT_USERNAME || process.env.USERNAME_ADF;

const EXTERNAL_ACS_HOST = process.env.EXTERNAL_ACS_HOST;

const appConfig = {
    "hostEcm": ECM_HOST,
    "hostBpm": BPM_HOST,
    "identityHost": `${OAUTH_HOST}/auth/admin/realms/alfresco`,
    "provider": PROVIDER,
    "authType": AUTH_TYPE,
    "oauth2": {
        "host": `${OAUTH_HOST}/auth/realms/alfresco`,
        "clientId": OAUTH_CLIENT_ID,
        "scope": "openid",
        "secret": "",
        "implicitFlow": true,
        "silentLogin": true,
        "redirectUri": "/",
        "redirectUriLogout": "/logout"
    }
};

if (LOG) {
    console.log('======= test.config.js hostBPM ====== ');
    console.log('hostBPM : ' + ECM_HOST);
    console.log('hostECM : ' + BPM_HOST);
    console.log('HOST : ' + HOST);
    console.log('USERNAME_ADF : ' + USERNAME_ADF + ' PASSWORD_ADF : ' + PASSWORD_ADF);
    console.log('IDENTITY_ADMIN_EMAIL : ' + IDENTITY_ADMIN_EMAIL + ' IDENTITY_ADMIN_PASSWORD : ' + IDENTITY_ADMIN_PASSWORD);
}

module.exports = {

    projectName: 'ADF',

    appConfig: appConfig,

    log: LOG,

    main: {
        rootPath: __dirname
    },

    admin: {
        email: USERNAME_ADF,
        password: PASSWORD_ADF
    },

    identityAdmin: {
        email: IDENTITY_ADMIN_EMAIL,
        password: IDENTITY_ADMIN_PASSWORD
    },

    hrUser: {
        email: HR_USER,
        password: HR_USER_PASSWORD
    },

    screenshot: {
        url: SCREENSHOT_URL,
        password: SCREENSHOT_PASSWORD,
        username: SCREENSHOT_USERNAME
    },

    adf: {
        /**
         * base
         */
        url: HOST
    },

    adf_external_acs: {
        /**
         * @config main.protocol {String}
         */
        host: EXTERNAL_ACS_HOST,
    },

};
