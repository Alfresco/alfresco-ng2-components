class SettingsPage {
    providerDropdown = 'mat-select[#adf-provider-selector]';
    ecmText = 'input[data-automation-id*="ecmHost"]';
    authHostText = '#oauthHost';
    identityHostText = '#identityHost';
    clientIdText = '#clientId';
    logoutUrlText = '#logout-url';
    applyButton = 'button[data-automation-id*="host-button"]';
    silentLoginToggleLabel = 'mat-slide-toggle[name="silentLogin"] label';

    navigate() {
        const url = `/#/settings`;
        cy.visit(url);
    }

    setProviderEcmSso(contentServiceURL, authHost, identityHost, clientId) {
        // this.navigate();
        cy.get(providerDropdown).select('ECM');
        cy.get('[id*="mat-radio"]').contains('SSO').click();
        cy.get(ecmText).clear().type(contentServiceURL);
        cy.get(authHostText).clear().type(authHost);
        cy.get(identityHostText).clear().type(identityHost);
        cy.get(silentLoginToggleLabel).click();
        cy.get(clientIdText).clear().type(clientId);
        cy.get(logoutUrlText).clear().type('/logout');
        cy.get(applyButton).click();
    }
}
export default SettingsPage;
