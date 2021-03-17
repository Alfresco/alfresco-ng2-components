import UserInfoPage from '../../pages/user-info.page';

describe('Login', () => {
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

    it('Login UI test', () => {
        cy.visit('/#/home');
        userInfo.getUserFullName().should('contain', 'HR User');
    })
})
