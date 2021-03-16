class LoginPage {
    getUserName() {
        return cy.get('[id="username"]');
    }
    getPassword() {
        return cy.get('[id="password"]');
    }
    getLoginButton() {
        return cy.get('.submit');
    }
}
export default LoginPage
