class SettingsPage {
    providerDropdown = '#adf-provider-selector';
    ecmText = '[data-automation-id*="ecmHost"]';
    authHostText = '#oauthHost';
    identityHostText = '#identityHost';
    clientIdText = '#clientId';
    logoutUrlText = '#logout-url';
    applyButton = '[data-automation-id="host-button"]';
    silentLoginToggleLabel = 'mat-slide-toggle[name="silentLogin"] label';

    navigate() {
        const url = `/#/settings`;
        cy.visit(url);
    }



    setProviderEcmSso(contentServiceURL, authHost, identityHost, clientId) {
        cy.get(this.providerDropdown).click().get('mat-option').contains('ECM').click();
        cy.get('[id*="mat-radio"]').contains('SSO').click();
        cy.get(this.ecmText).clear().type(contentServiceURL);
        cy.get(this.authHostText).clear().type(authHost);
        cy.get(this.identityHostText).clear().type(identityHost);
        cy.get(this.silentLoginToggleLabel).click();
        cy.get(this.clientIdText).clear().type(clientId);
        cy.get(this.logoutUrlText).clear().type('/logout');
        cy.get(this.applyButton).click();
    }
}
export default SettingsPage;
