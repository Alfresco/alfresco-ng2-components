/**
 * Contains the default app deployment settings
 * @class config.test.config
 */

var HOST = process.env.URL_HOST_ADF;
const HOST_BPM = process.env.URL_HOST_BPM_ADF;
const HOST_SSO = process.env.URL_HOST_SSO_ADF;
const HOST_IDENTITY = process.env.URL_HOST_IDENTITY;
var USERNAME = process.env.USERNAME_ADF;
var PASSWORD = process.env.PASSWORD_ADF;
var EMAIL = process.env.EMAIL_ADF;
var TIMEOUT = parseInt(process.env.TIMEOUT, 10);

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

        hostBPM: "http://" + HOST_BPM,

        hostSso: "http://" + HOST_SSO,

        hostIdentity: "http://" + HOST_IDENTITY

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
