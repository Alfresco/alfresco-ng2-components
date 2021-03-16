import LoginPage from '../../pages/login-page';
import UserInfoPage from '../../pages/user-info.page'

describe('Login', function() {
    it('Login UI test', function() {
        const loginPage = new LoginPage();
        const userInfo = new UserInfoPage();
        cy.visit('https://url...');
        loginPage.getUserName().type('hsdhdf');
        loginPage.getPassword().type('dshfdh');
        loginPage.getLoginButton().click();
        userInfo.getUserFullName().should('contain', 'HR User');
    })
})
