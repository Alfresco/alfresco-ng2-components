/**
 * Contains the default app deployment settings
 * @class config.test.config
 */

require('dotenv').config({path: process.env.ENV_FILE});

const HOST = process.env.URL_HOST_ADF;

const TIMEOUT = parseInt(process.env.TIMEOUT, 10);
const LOG = process.env.LOG;

const ECM_HOST = process.env.URL_HOST_BPM_ADF || process.env.PROXY_HOST_ADF || HOST|| 'ecm';
const BPM_HOST = process.env.URL_HOST_ECM_ADF || process.env.PROXY_HOST_ADF || HOST|| 'bpm';
const OAUTH_HOST= process.env.URL_HOST_SSO_ADF  ||  process.env.PROXY_HOST_ADF  || HOST|| 'oauth';
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENDID || 'alfresco';

const IDENTITY_ADMIN_EMAIL = process.env.IDENTITY_ADMIN_EMAIL || "defaultadmin";
const IDENTITY_ADMIN_PASSWORD = process.env.IDENTITY_ADMIN_PASSWORD || "defaultadminpassword";
const IDENTITY_USERNAME_ADF = process.env.IDENTITY_USERNAME_ADF || "defaultuser";
const IDENTITY_PASSWORD_ADF = process.env.IDENTITY_PASSWORD_ADF;

const USERNAME_ADF = process.env.USERNAME_ADF || "defaultuser";
const PASSWORD_ADF = process.env.PASSWORD_ADF || "defaultuserpassword";
const EMAIL = process.env.EMAIL_ADF || USERNAME_ADF;

const SCREENSHOT_URL = process.env.SCREENSHOT_URL || process.env.URL_HOST_ADF;
const SCREENSHOT_PASSWORD = process.env.SCREENSHOT_PASSWORD || process.env.PASSWORD_ADF;
const SCREENSHOT_USERNAME = process.env.SCREENSHOT_USERNAME || process.env.USERNAME_ADF;

const EXTERNAL_ACS_HOST = process.env.EXTERNAL_ACS_HOST;
const PROVIDER = process.env.PROVIDER ? process.env.PROVIDER : 'OAUTH';

const appConfig = {
    "ecmHost": ECM_HOST,
    "bpmHost": BPM_HOST,
    "identityHost": `${OAUTH_HOST}/auth/admin/realms/alfresco`,
    "providers": "BPM",
    "authType": PROVIDER,
    "oauth2": {
        "host":  `${OAUTH_HOST}/auth/realms/alfresco`,
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
    console.log('EMAIL : ' + (EMAIL));
    console.log('HOST : ' + HOST);
    console.log('USERNAME_ADF : ' + USERNAME_ADF + ' PASSWORD_ADF : ' + PASSWORD_ADF);
    console.log('IDENTITY_ADMIN_EMAIL : ' + IDENTITY_ADMIN_EMAIL + ' IDENTITY_ADMIN_PASSWORD : ' + IDENTITY_ADMIN_PASSWORD);
    console.log(JSON.stringify(appConfig))
}

module.exports = {

    projectName: 'ADF',

    appConfig: appConfig,

    log: LOG,

    main: {
        timeout: TIMEOUT,
        rootPath: __dirname
    },

    identityAdmin: {
        email: IDENTITY_ADMIN_EMAIL,
        password: IDENTITY_ADMIN_PASSWORD
    },

    identityUser: {
        email: IDENTITY_USERNAME_ADF,
        password: IDENTITY_PASSWORD_ADF
    },

    hrUser: {
        email: process.env.HR_USER,
        password: process.env.HR_USER_PASSWORD
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
        url: HOST,

        /**
         * adf port
         */
        port: "",

        /**
         * adf login
         */
        login: "/login",

        /**
         * admin username
         */
        adminUser: USERNAME_ADF,

        /**
         * main admin email
         */
        adminEmail: EMAIL,

        /**
         * main admin password
         */
        adminPassword: PASSWORD_ADF

    },

    adf_acs: {
        /**
         * The protocol where the app runs.
         * @config main.protocol {String}
         */
        protocol: "http",

        /**
         * The protocol where the app runs.
         * @config main.protocol {String}
         */
        host: ECM_HOST,

        /**
         * The port where the app runs.
         * @config main.port {String}
         */
        port: "",

        /**
         * The ECM API context required for calls
         * @config adf.ACSAPIContextRoot {String}
         */
        apiContextRoot: "/alfresco/api/-default-/public",

        clientIdSso: "alfresco",
    },

    adf_external_acs: {
        /**
         * The protocol where the app runs.
         * @config main.protocol {String}
         */
        protocol: "http",

        /**
         * The protocol where the app runs.
         * @config main.protocol {String}
         */
        host: EXTERNAL_ACS_HOST,

        /**
         * The port where the app runs.
         * @config main.port {String}
         */
        port: "",

        /**
         * The ECM API context required for calls
         * @config adf.ACSAPIContextRoot {String}
         */
        apiContextRoot: "/alfresco/api/-default-/public",

        clientIdSso: "alfresco",
    },

    adf_aps: {
        /**
         * The protocol where the app runs.
         * @config main.protocol {String}
         */
        protocol: "http",

        /**
         * The host where the app runs.
         * @config main.host {String}
         */
        host: BPM_HOST,

        /**
         * The port where the app runs.
         * @config main.port {String}
         */
        port: "",

        /**
         * The BPM API context required for calls
         * @config adf.APSAPIContextRoot {String}
         */
        apiContextRoot: "/activiti-app",

        clientIdSso: "activiti"
    }

};
