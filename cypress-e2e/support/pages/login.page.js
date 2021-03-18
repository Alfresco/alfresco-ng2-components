class LoginPage {

    navigate() {
        const loginUrl = `/#/login`;
        cy.visit(loginUrl);
    }

    getUserName() {
        return cy.get('#username');
    }
    getPassword() {
        return cy.get('#password');
    }
    getLoginButton() {
        return cy.get('.submit');
    }
}
export default LoginPage;
