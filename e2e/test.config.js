/**
 * Contains the default app deployment settings
 * @class config.test.config
 */

require('dotenv').config({path: process.env.ENV_FILE});

const HOST = process.env.URL_HOST_ADF;

const LOG = process.env.E2E_LOG_LEVEL;

const HOST_ECM = process.env.PROXY_HOST_ECM || HOST || 'ecm';
const HOST_BPM = process.env.PROXY_HOST_BPM || HOST || 'bpm';

const PROVIDER = process.env.PROVIDER ? process.env.PROVIDER : 'ALL';
const AUTH_TYPE = process.env.AUTH_TYPE ? process.env.AUTH_TYPE : 'BASIC';

const HOST_SSO = process.env.HOST_SSO || process.env.PROXY_HOST_ADF || HOST || 'oauth';
const IDENTITY_HOST = process.env.IDENTITY_HOST || process.env.HOST_SSO + '/auth/admin/realms/alfresco';
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENDID || 'alfresco';

const IDENTITY_ADMIN_EMAIL = process.env.IDENTITY_ADMIN_EMAIL || "defaultadmin";
const IDENTITY_ADMIN_PASSWORD = process.env.IDENTITY_ADMIN_PASSWORD || "defaultadminpassword";

const HR_USER = process.env.HR_USER || "hruser";
const HR_USER_PASSWORD = process.env.HR_USER_PASSWORD || "defaulthruserpassword";

const USERNAME_ADF = process.env.USERNAME_ADF || "defaultuser";
const PASSWORD_ADF = process.env.PASSWORD_ADF || "defaultuserpassword";

const USERNAME_SUPER_ADMIN_ADF = process.env.USERNAME_SUPER_ADMIN_ADF || "defaultuser";
const PASSWORD_SUPER_ADMIN_ADF = process.env.PASSWORD_SUPER_ADMIN_ADF || "defaultuserpassword";

const REDIRECT_URI = process.env.REDIRECT_URI || "/";
const REDIRECT_URI_LOGOUT = process.env.REDIRECT_URI_LOGOUT || "#/logout";

const EXTERNAL_ACS_HOST = process.env.EXTERNAL_ACS_HOST;
const E2E_LOG_LEVEL = process.env.E2E_LOG_LEVEL || 'ERROR';

const E2E_EMAIL_DOMAIN = process.env.E2E_EMAIL_DOMAIN || "example.com";

const appConfig = {
    "log": E2E_LOG_LEVEL,
    "ecmHost": HOST_ECM,
    "bpmHost": HOST_BPM,
    "identityHost": `${IDENTITY_HOST}`,
    "provider": PROVIDER,
    "authType": AUTH_TYPE,
    "oauth2": {
        "host": `${HOST_SSO}/auth/realms/alfresco`,
        "clientId": OAUTH_CLIENT_ID,
        "scope": "openid",
        "secret": "",
        "implicitFlow": true,
        "silentLogin": true,
        "redirectUri": REDIRECT_URI,
        "redirectUriLogout": REDIRECT_URI_LOGOUT,
        "redirectSilentIframeUri": `${HOST}/assets/silent-refresh.html`,
        "publicUrls": [
            "**/logout",
            "**/preview/s/*",
            "**/settings"
        ]
    }
};

if (LOG) {
    console.log('======= test.config.js hostBPM ====== ');
    console.log('hostBPM : ' + HOST_ECM);
    console.log('hostECM : ' + HOST_BPM);
    console.log('HOST : ' + HOST);
    console.log('USERNAME_ADF : ' + USERNAME_ADF + ' PASSWORD_ADF : ' + PASSWORD_ADF);
    console.log('IDENTITY_ADMIN_EMAIL : ' + IDENTITY_ADMIN_EMAIL + ' IDENTITY_ADMIN_PASSWORD : ' + IDENTITY_ADMIN_PASSWORD);
}

module.exports = {

    projectName: 'adf',
    emailDomain: E2E_EMAIL_DOMAIN,

    appConfig: appConfig,

    log: LOG,

    main: {
        rootPath: __dirname
    },

    users: {

        admin: {
            username: USERNAME_ADF,
            password: PASSWORD_ADF
        },

        superadmin: {
            username: USERNAME_SUPER_ADMIN_ADF,
            password: PASSWORD_SUPER_ADMIN_ADF
        },

        identityAdmin: {
            username: IDENTITY_ADMIN_EMAIL,
            password: IDENTITY_ADMIN_PASSWORD
        },

        hrUser: {
            username: HR_USER,
            password: HR_USER_PASSWORD
        },

        screenshot: {
            username: USERNAME_ADF,
            password: PASSWORD_ADF
        },
    },

    screenshot: {
        url: HOST_ECM,
    },

    adf_external_acs: {
        /**
         * @config main.protocol {String}
         */
        host: EXTERNAL_ACS_HOST,
    },

    timeouts: {
        visible_timeout: 10000,
        no_visible_timeout: 10000,
        index_search: 20000
    }

};
