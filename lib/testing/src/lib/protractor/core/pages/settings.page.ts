/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { $, browser, by, element } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';
import { DropdownPage } from '../../core/pages/material/dropdown.page';
import { materialLocators } from './public-api';

export class SettingsPage {
    settingsURL: string = browser.baseUrl + '/settings';
    ecmText = $('input[data-automation-id*="ecmHost"]');
    clientIdText = $('input[id="clientId"]');
    authHostText = $('input[id="oauthHost"]');
    logoutUrlText = $('input[id="logout-url"]');
    identityHostText = $('input[id="identityHost"]');
    ssoRadioButton = element(by.cssContainingText(`[id*="${materialLocators.Radio.root}"]`, 'SSO'));
    silentLoginToggleLabel = $(`${materialLocators.Slide.toggle.root}[formcontrolname="silentLogin"] label`);
    silentLoginToggleElement = $(`${materialLocators.Slide.toggle.root}[formcontrolname="silentLogin"]`);
    implicitFlowLabel = $(`${materialLocators.Slide.toggle.root}[formcontrolname="implicitFlow"] label`);
    implicitFlowElement = $(`${materialLocators.Slide.toggle.root}[formcontrolname="implicitFlow"]`);
    codeFlowElement = $(`${materialLocators.Slide.toggle.root}[formcontrolname="codeFlow"]`);
    applyButton = $('button[data-automation-id="settings-apply-button"]');
    ssoSignInButton = $('[id="login-button-sso"]');
    providerDropdown = new DropdownPage($(`${materialLocators.Select.root}[id="adf-provider-selector"]`));

    async goToSettingsPage(): Promise<void> {
        let currentUrl;

        try {
            currentUrl = await browser.getCurrentUrl();
        } catch (e) {}

        if (!currentUrl || currentUrl.indexOf(this.settingsURL) === -1) {
            await browser.get(this.settingsURL);
        }
        await this.providerDropdown.checkDropdownIsVisible();
    }

    async setProvider(option): Promise<void> {
        await this.providerDropdown.selectDropdownOption(option);
        await this.providerDropdown.checkOptionIsSelected(option);
    }

    async clickSsoRadioButton() {
        await BrowserActions.click(this.ssoRadioButton);
    }

    async setProviderEcmSso(
        contentServiceURL,
        authHost,
        identityHost,
        silentLogin = true,
        implicitFlow = false,
        clientId?: string,
        logoutUrl: string = '/logout'
    ) {
        await this.goToSettingsPage();
        await this.setProvider('ECM');
        await this.clickSsoRadioButton();
        await this.setContentServicesURL(contentServiceURL);
        await this.setAuthHost(authHost);
        await this.setIdentityHost(identityHost);
        await this.setSilentLogin(silentLogin);
        await this.setImplicitFlow(implicitFlow);
        await this.setClientId(clientId);
        await this.setLogoutUrl(logoutUrl);
        await this.clickApply();
    }

    async setProviderEcmSsoWithoutCodeFlow(
        contentServiceURL,
        authHost,
        identityHost,
        silentLogin = true,
        implicitFlow = false,
        clientId?: string,
        logoutUrl: string = '/logout'
    ) {
        await this.goToSettingsPage();
        await this.setProvider('ECM');
        await this.clickSsoRadioButton();
        await this.setContentServicesURL(contentServiceURL);
        await this.setAuthHost(authHost);
        await this.setIdentityHost(identityHost);
        await this.setSilentLogin(silentLogin);
        await this.setCodeFlow(false);
        await this.setImplicitFlow(implicitFlow);
        await this.setClientId(clientId);
        await this.setLogoutUrl(logoutUrl);
        await this.clickApply();
        await this.clickSignInSSO();
    }

    async setLogoutUrl(logoutUrl) {
        await BrowserVisibility.waitUntilElementIsPresent(this.logoutUrlText);
        await BrowserActions.clearSendKeys(this.logoutUrlText, logoutUrl);
    }

    async setClientId(clientId: string = browser.params.testConfig.appConfig.oauth2.clientId) {
        await BrowserActions.clearSendKeys(this.clientIdText, clientId);
    }

    async setContentServicesURL(contentServiceURL) {
        await BrowserActions.clearSendKeys(this.ecmText, contentServiceURL);
    }

    async setAuthHost(authHostURL) {
        await BrowserActions.clearSendKeys(this.authHostText, authHostURL);
    }

    async setIdentityHost(identityHost) {
        await BrowserActions.clearSendKeys(this.identityHostText, identityHost);
    }

    async clickApply() {
        await BrowserActions.click(this.applyButton);
    }

    async clickSignInSSO() {
        const isPresent = await this.ssoSignInButton.isPresent();
        if (isPresent) {
            await BrowserActions.click(this.ssoSignInButton);
        }
    }

    async setSilentLogin(enableToggle) {
        await BrowserVisibility.waitUntilElementIsVisible(this.silentLoginToggleElement);

        const isChecked = (await BrowserActions.getAttribute(this.silentLoginToggleElement, 'class')).includes(materialLocators.Checked.root);

        if ((isChecked && !enableToggle) || (!isChecked && enableToggle)) {
            await BrowserActions.click(this.silentLoginToggleLabel);
        }
    }

    async setImplicitFlow(enableToggle) {
        await BrowserVisibility.waitUntilElementIsVisible(this.implicitFlowElement);

        const isChecked = (await BrowserActions.getAttribute(this.implicitFlowElement, 'class')).includes(materialLocators.Checked.root);

        if ((isChecked && !enableToggle) || (!isChecked && enableToggle)) {
            await BrowserActions.click(this.implicitFlowLabel);
        }
    }

    async setCodeFlow(enableToggle) {
        await BrowserVisibility.waitUntilElementIsVisible(this.codeFlowElement);

        const isChecked = (await BrowserActions.getAttribute(this.codeFlowElement, 'class')).includes(materialLocators.Checked.root);

        if ((isChecked && !enableToggle) || (!isChecked && enableToggle)) {
            await BrowserActions.click(this.codeFlowElement);
        }
    }
}
