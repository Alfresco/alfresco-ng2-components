class UserInfoPage {
    getUserFullName() {
        return cy.get('#adf-userinfo-identity-name-display');
    }
}
export default UserInfoPage;
