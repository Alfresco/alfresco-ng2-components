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
    bpmText = $('input[data-automation-id*="bpmHost"]');
    clientIdText = $('input[id="clientId"]');
    authHostText = $('input[id="oauthHost"]');
    logoutUrlText = $('input[id="logout-url"]');
    basicAuthRadioButton = element(by.cssContainingText('mat-radio-button[id*="mat-radio"]', 'Basic Authentication'));
    identityHostText = $('input[id="identityHost"]');
    ssoRadioButton = element(by.cssContainingText('[id*="mat-radio"]', 'SSO'));
    silentLoginToggleLabel = $('mat-slide-toggle[formcontrolname="silentLogin"] label');
    silentLoginToggleElement = $('mat-slide-toggle[formcontrolname="silentLogin"]');
    implicitFlowLabel = $('mat-slide-toggle[formcontrolname="implicitFlow"] label');
    implicitFlowElement = $('mat-slide-toggle[formcontrolname="implicitFlow"]');
    applyButton = $('button[data-automation-id*="host-button"]');
    backButton = element(by.cssContainingText('button .mat-button-wrapper', 'Back'));
    validationMessage = element(by.cssContainingText('mat-error', 'This field is required'));

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

    async getSelectedOptionText(): Promise<string> {
        return this.providerDropdown.getSelectedOptionText();
    }

    async getBpmHostUrl() {
        return BrowserActions.getInputValue(this.bpmText);
    }

    async getEcmHostUrl() {
        return BrowserActions.getInputValue(this.ecmText);
    }

    async setProviderEcmBpm() {
        await this.setProvider('ALL');
        await this.clickApply();
    }

    async setProviderBpm() {
        await this.setProvider('BPM');
        await this.clickApply();
    }

    async setProviderEcm() {
        await this.setProvider('ECM');
        await this.clickApply();
    }

    async setProviderOauth() {
        await this.goToSettingsPage();
        await this.setProvider('OAUTH');
        await this.clickApply();
    }

    async clickBackButton() {
        await BrowserActions.click(this.backButton);
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

    async setProviderBpmSso(processServiceURL, authHost, identityHost, silentLogin = true, implicitFlow = true) {
        await this.goToSettingsPage();
        await this.setProvider('BPM');
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.ecmText);
        await this.clickSsoRadioButton();
        await this.setClientId();
        await this.setProcessServicesURL(processServiceURL);
        await this.setAuthHost(authHost);
        await this.setIdentityHost(identityHost);
        await this.setSilentLogin(silentLogin);
        await this.setImplicitFlow(implicitFlow);
        await this.clickApply();
        await browser.sleep(1000);
    }

    async setProviderEcmBpmSso(contentServicesURL: string, processServiceURL, authHost, identityHost, clientId: string, silentLogin = true, implicitFlow = true) {
        await this.goToSettingsPage();
        await this.setProvider('ALL');
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        await this.clickSsoRadioButton();
        await this.setClientId(clientId);
        await this.setContentServicesURL(contentServicesURL);
        await this.setProcessServicesURL(processServiceURL);
        await this.setAuthHost(authHost);
        await this.setIdentityHost(identityHost);
        await this.setSilentLogin(silentLogin);
        await this.setImplicitFlow(implicitFlow);
        await this.clickApply();
        await browser.sleep(1000);
    }

    async setLogoutUrl(logoutUrl) {
        await BrowserVisibility.waitUntilElementIsPresent(this.logoutUrlText);
        await BrowserActions.clearSendKeys(this.logoutUrlText, logoutUrl);
    }

    async setProcessServicesURL(processServiceURL) {
        await BrowserActions.clearSendKeys(this.bpmText, processServiceURL);
    }

    async setClientId(clientId: string = browser.params.testConfig.appConfig.oauth2.clientId) {
        await BrowserActions.clearSendKeys(this.clientIdText, clientId);
    }

    async setContentServicesURL(contentServiceURL) {
        await BrowserActions.clearSendKeys(this.ecmText, contentServiceURL);
    }

    async clearContentServicesURL() {
        await BrowserActions.clearWithBackSpace(this.ecmText);
    }

    async clearProcessServicesURL() {
        await BrowserActions.clearWithBackSpace(this.bpmText);
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

    async checkApplyButtonIsDisabled() {
        await BrowserVisibility.waitUntilElementIsVisible($('button[data-automation-id*="host-button"]:disabled'));
    }

    async checkProviderDropdownIsDisplayed() {
        await this.providerDropdown.checkDropdownIsVisible();
    }

    async checkValidationMessageIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.validationMessage);
    }

    async checkProviderOptions() {
        await this.providerDropdown.clickDropdown();
        await this.providerDropdown.checkOptionIsDisplayed('ALL');
        await this.providerDropdown.checkOptionIsDisplayed('ECM');
        await this.providerDropdown.checkOptionIsDisplayed('BPM');
    }

    getBasicAuthRadioButton() {
        return this.basicAuthRadioButton;
    }

    getSsoRadioButton() {
        return this.ssoRadioButton;
    }

    getBackButton() {
        return this.backButton;
    }

    getApplyButton() {
        return this.applyButton;
    }

    async checkBasicAuthRadioIsSelected() {
        const radioButton = this.getBasicAuthRadioButton();

        await expect(await BrowserActions.getAttribute(radioButton, 'class')).toContain('mat-radio-checked');
    }

    async checkSsoRadioIsNotSelected() {
        const radioButton = this.getSsoRadioButton();
        await expect(await BrowserActions.getAttribute(radioButton, 'class')).not.toContain('mat-radio-checked');
    }
}
