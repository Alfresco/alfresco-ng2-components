/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export class SettingsPage {
    settingsURL: string = browser.baseUrl + '/settings';
    ecmText = $('input[data-automation-id*="ecmHost"]');
    clientIdText = $('input[id="clientId"]');
    authHostText = $('input[id="oauthHost"]');
    logoutUrlText = $('input[id="logout-url"]');
    identityHostText = $('input[id="identityHost"]');
    ssoRadioButton = element(by.cssContainingText('[id*="mat-radio"]', 'SSO'));
    silentLoginToggleLabel = $('mat-slide-toggle[formcontrolname="silentLogin"] label');
    silentLoginToggleElement = $('mat-slide-toggle[formcontrolname="silentLogin"]');
    implicitFlowLabel = $('mat-slide-toggle[formcontrolname="implicitFlow"] label');
    implicitFlowElement = $('mat-slide-toggle[formcontrolname="implicitFlow"]');
    applyButton = $('button[data-automation-id="settings-apply-button"]');
    providerDropdown = new DropdownPage($('mat-select[id="adf-provider-selector"]'));

    async goToSettingsPage(): Promise<void> {
        let currentUrl;

        try {
            currentUrl = await browser.getCurrentUrl();
        } catch (e) {
        }

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

    async setProviderEcmSso(contentServiceURL, authHost, identityHost, silentLogin = true, implicitFlow = true, clientId?: string, logoutUrl: string = '/logout') {
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
        await browser.sleep(1000);
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

    async setSilentLogin(enableToggle) {
        await BrowserVisibility.waitUntilElementIsVisible(this.silentLoginToggleElement);

        const isChecked = (await BrowserActions.getAttribute(this.silentLoginToggleElement, 'class')).includes('mat-checked');

        if (isChecked && !enableToggle || !isChecked && enableToggle) {
            await BrowserActions.click(this.silentLoginToggleLabel);
        }
    }

    async setImplicitFlow(enableToggle) {
        await BrowserVisibility.waitUntilElementIsVisible(this.implicitFlowElement);

        const isChecked = (await BrowserActions.getAttribute(this.implicitFlowElement, 'class')).includes('mat-checked');

        if (isChecked && !enableToggle || !isChecked && enableToggle) {
            await BrowserActions.click(this.implicitFlowLabel);
        }
    }
}
