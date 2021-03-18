/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

import { resolve } from 'path';

require('dotenv').config({ path: resolve(__dirname, '../../.env') });

module.exports = (on, config) => {

    config.baseUrl = process.env.URL_HOST_ADF;
    config.env.baseUrl = process.env.URL_HOST_ADF;
    config.env.hr_user = process.env.HR_USER;
    config.env.hr_user_password = process.env.HR_USER_PASSWORD;
    config.env.ecmHost = process.env.PROXY_HOST_ADF;
    config.env.identityHost = `${process.env.HOST_SSO}/auth/admin/realms/alfresco`;
    config.env.oauth2Host = `${process.env.HOST_SSO}/auth/realms/alfresco`;
    config.env.oauth2ClientId = 'alfresco';

    return config;
};
