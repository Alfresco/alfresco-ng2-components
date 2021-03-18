/// <reference types="cypress" />
import UserInfoPage from '../../support/pages/user-info.page';

describe('User info with UI Login', () => {
    const userInfo = new UserInfoPage();
    const username = Cypress.env('hr_user');
    const password = Cypress.env('hr_user_password');
    const ecmHost = Cypress.env('ecmHost')
    const identityHost = Cypress.env('identityHost');
    const oauth2Host = Cypress.env('oauth2Host');
    const oauth2ClientId = Cypress.env('oauth2ClientId');

    before(() => {
        cy.loginUI(username, password)
            // .then(() => {
            //     cy.setProviderEcmSso(ecmHost, identityHost, oauth2Host, oauth2ClientId);
            //     cy.loginUI(username, password);
            // })
    })

    after(() => {
        cy.logout();
        cy.visit('/');
    })

    it('Should display UserInfo when login', () => {
        cy.visit('/#/home');
        userInfo.clickUserProfile();
        userInfo.getSsoHeaderTitle().should('eq', 'HR User');
        userInfo.getSsoTitle().should('eq', 'HR User');
        userInfo.getSsoEmail().should('eq', ' hruser@example.com ');
        userInfo.closeUserProfile();
        userInfo.dialogIsNotDisplayed();
    })
})
