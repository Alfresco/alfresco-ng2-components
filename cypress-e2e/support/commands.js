/// <reference types="cypress" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
import LoginPage from '../support/pages/login.page';
import UserInfoPage from '../support/pages/user-info.page';
import SettingsPage from '../support/pages/settings.page';

import 'cypress-keycloak';


Cypress.Commands.add('loginUI', (userName, password) => {
    const loginPage = new LoginPage();
    loginPage.navigate();
    loginPage.getUserName().type(userName);
    loginPage.getPassword().type(password);
    loginPage.getLoginButton().click();
});

Cypress.Commands.overwrite('login', (originalFn, userName, password) => {
    originalFn({
      root: 'https://develop.envalfresco.com',
      realm: 'alfresco',
      username: userName,
      password: password,
      client_id: 'alfresco',
      redirect_uri: '/'
    });
});

Cypress.Commands.overwrite('logout', (originalFn) => {
    cy.clearLocalStorage();
    originalFn({
        root: 'https://develop.envalfresco.com',
        realm: 'alfresco',
        redirect_uri: '/',
    });
});

Cypress.Commands.add('isUserLoggedIn', (username) => {
    const userInfo = new UserInfoPage();
    userInfo.getUserFullName().should('contain', username);
});

Cypress.Commands.add('setProviderEcmSso', (ecmHost, oauth2Host, identityHost, oauth2ClientId) => {
    const settingsPage = new SettingsPage();
    settingsPage.navigate();
    settingsPage.setProviderEcmSso(ecmHost, oauth2Host, identityHost, oauth2ClientId);
});




//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
