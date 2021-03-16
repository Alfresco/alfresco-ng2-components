class UserInfoPage {
    getUserFullName() {
        return cy.get('[id="adf-userinfo-identity-name-display"]');
    }
}
export default UserInfoPage