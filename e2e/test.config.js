/**
 * Contains the default app deployment settings
 * @class config.test.config
 */

var HOST = process.env.URL_HOST_ADF;
const HOST_SSO = process.env.URL_HOST_SSO_ADF;
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

        hostSso: "http://" + HOST_SSO

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
        apiContextRoot: "/activiti-app"
    }

};
