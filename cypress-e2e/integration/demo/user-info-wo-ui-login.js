import UserInfoPage from '../../support/pages/user-info.page';

describe('User Info without UI Login', () => {
    const userInfo = new UserInfoPage();
    const username = Cypress.env('hr_user');
    const password = Cypress.env('hr_user_password');

    before(() => {
        cy.login(username, password);
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
