import UserInfoPage from '../../pages/user-info.page';

describe('Login', function() {
    it('Login UI test', function() {

        const userInfo = new UserInfoPage();
        cy.visit('https://');
        cy.login('user', 'pswd');
        userInfo.getUserFullName().should('contain', 'HR User');
    })
})
