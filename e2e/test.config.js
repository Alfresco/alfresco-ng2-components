/**
 * Contains the default app deployment settings
 * @class config.test.config
 */

const HOST = process.env.URL_HOST_ADF;
const HOST_BPM = process.env.URL_HOST_BPM_ADF;
const HOST_SSO = process.env.URL_HOST_SSO_ADF;
const HOST_IDENTITY = process.env.URL_HOST_IDENTITY;
const USERNAME = process.env.USERNAME_ADF;
const PASSWORD = process.env.PASSWORD_ADF;
const EMAIL = process.env.EMAIL_ADF;
const TIMEOUT = parseInt(process.env.TIMEOUT, 10);
const PROXY = process.env.PROXY_HOST_ADF;

module.exports = {

    main: {
        timeout: TIMEOUT,
        rootPath: __dirname
    },

    adf: {
        /**
         * base
         */
        url: "http://" + HOST,

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
        adminUser: USERNAME,

        /**
         * main admin email
         */
        adminEmail: EMAIL,

        /**
         * main admin password
         */
        adminPassword: PASSWORD,

        hostBPM: "https://" + ( HOST_BPM || PROXY || HOST),

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

            return `https://${baseUrl}/auth/realms/alfresco`;
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


            return `https://${baseUrl}/auth/admin/realms/alfresco`;
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
        host: HOST,

        /** 
         * * The port where the app runs. 
         * * @config main.port {String} 
         * */
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
        host: HOST,

        /** 
         * * The port where the app runs. 
         * * @config main.port {String} 
         * */
        port: "",

        /**  
         * The BPM API context required for calls  
         * @config adf.APSAPIContextRoot {String}  
         */
        apiContextRoot: "/activiti-app",

        clientIdSso: "activiti",
    }

};
