import UserInfoPage from '../../pages/user-info.page';

describe('Login', () => {
    it('Login UI test', () => {
        const userInfo = new UserInfoPage();

        const username = Cypress.env('hr_user');
        const password = Cypress.env('hr_user_password');

        cy.login(username, password);
        userInfo.getUserFullName().should('contain', 'HR User');
    })
})
