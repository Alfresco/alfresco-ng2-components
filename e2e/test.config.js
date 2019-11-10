/**
 * Contains the default app deployment settings
 * @class config.test.config
 */

require('dotenv').config({path: process.env.ENV_FILE});

const HOST = process.env.URL_HOST_ADF;
const HOST_BPM = process.env.URL_HOST_BPM_ADF;
const HOST_SSO = process.env.URL_HOST_SSO_ADF;
const HOST_IDENTITY = process.env.URL_HOST_IDENTITY;
const TIMEOUT = parseInt(process.env.TIMEOUT, 10);
const PROXY = process.env.PROXY_HOST_ADF;
const LOG = process.env.LOG;
const BPM_HOST = process.env.URL_HOST_BPM_ADF || "bpm";
const OAUTH_HOST = process.env.URL_HOST_SSO_ADF || "keycloak";
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENDID || "alfresco";

const IDENTITY_HOST = process.env.URL_HOST_IDENTITY || "identity";
const IDENTITY_ADMIN_EMAIL = process.env.IDENTITY_ADMIN_EMAIL || "defaultadmin";
const IDENTITY_ADMIN_PASSWORD = process.env.IDENTITY_ADMIN_PASSWORD || "defaultadminpassword";

const USERNAME_ADF = process.env.USERNAME_ADF || process.env.IDENTITY_USERNAME_ADF || "defaultuser";
const PASSWORD_ADF = process.env.PASSWORD_ADF || process.env.IDENTITY_PASSWORD_ADF || "defaultuserpassword";
const EMAIL = process.env.EMAIL_ADF || USERNAME_ADF;

const appConfig = {
    "bpmHost": BPM_HOST,
    "identityHost": IDENTITY_HOST,
    "providers": "BPM",
    "authType": "OAUTH",
    "oauth2": {
        "host": OAUTH_HOST,
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
    console.log('hostBPM : ' + (HOST_BPM || PROXY || HOST));
    console.log('EMAIL : ' + (EMAIL));
    console.log('PROXY_HOST_ADF : ' + PROXY);
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
        email: USERNAME_ADF,
        password: PASSWORD_ADF
    },

    hrUser: {
        email: process.env.HR_USER,
        password: process.env.HR_USER_PASSWORD
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
        adminPassword: PASSWORD_ADF,

        hostBPM: HOST_BPM || PROXY || HOST,

        clientIdSso: "alfresco",

        hostSso: function () {
            let baseUrl;

            if (HOST_SSO) {
                baseUrl = HOST_SSO;
            } else if (PROXY) {
                baseUrl = PROXY;
            } else {
                baseUrl = HOST;
            }

            if (LOG) {
                console.log('hostSso baseUrl : ' + baseUrl);
            }

            return `${baseUrl}/auth/realms/alfresco`;
        }(),

        hostIdentity: function () {
            let baseUrl;

            if (HOST_IDENTITY) {
                baseUrl = HOST_IDENTITY;
            } else if (HOST_SSO) {
                baseUrl = HOST_SSO;
            } else if (PROXY) {
                baseUrl = PROXY;
            } else {
                baseUrl = HOST;
            }

            if (LOG) {
                console.log('hostIdentity baseUrl : ' + baseUrl);
            }

            return `${baseUrl}/auth/admin/realms/alfresco`;
        }()

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
        host: PROXY || HOST,

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
        host: PROXY || HOST,

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
