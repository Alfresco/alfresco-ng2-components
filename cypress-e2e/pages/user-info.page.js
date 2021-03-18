class UserInfoPage {
    getUserFullName() {
        return cy.get('#adf-userinfo-identity-name-display');
    }

    clickUserProfile() {
        cy.get('[data-automation-id="adf-user-profile"]').click();
    }

    getSsoHeaderTitle() {
        return cy.get('#identity-username').invoke('text');
    }

    getSsoTitle() {
        return cy.get('.adf-userinfo__detail-title').invoke('text');
    }

    getSsoEmail() {
        return cy.get('#identity-email').invoke('text');
    }

    closeUserProfile() {
        cy.get('body')
        .type('{esc}')
        .then(() => {
            cy.get('.mat-h1').should('contain', 'ADF');
        });
        
    }

    dialogIsNotDisplayed() {
        cy.get('.adf-userinfo-card').should('not.be.visible');;
    }
    
}
export default UserInfoPage;
