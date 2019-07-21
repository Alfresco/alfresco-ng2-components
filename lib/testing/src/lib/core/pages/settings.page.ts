/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { browser, by, element, protractor } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';

export class SettingsPage {

    settingsURL = browser.baseUrl + '/settings';
    providerDropdown = element(by.css('mat-select[id="adf-provider-selector"] div[class="mat-select-arrow-wrapper"]'));
    ecmAndBpm = {
        option: element(by.xpath('//SPAN[@class="mat-option-text"][contains(text(),"ALL")]')),
        text: 'ALL'
    };
    bpm = {
        option: element(by.xpath('//SPAN[@class="mat-option-text"][contains(text(),"BPM") and not (contains(text(),"and"))]')),
        text: 'BPM'
    };
    ecm = {
        option: element(by.xpath('//SPAN[@class="mat-option-text"][contains(text(),"ECM") and not (contains(text(),"and"))]')),
        text: 'ECM'
    };
    oauth = {
        option: element(by.xpath('//SPAN[@class="mat-option-text"][contains(text(),"OAUTH")]')),
        text: 'OAUTH'
    };
    selectedOption = element(by.css('span[class*="mat-select-value-text"]'));
    ecmText = element(by.css('input[data-automation-id*="ecmHost"]'));
    bpmText = element(by.css('input[data-automation-id*="bpmHost"]'));
    clientIdText = element(by.css('input[id="clientId"]'));
    authHostText = element(by.css('input[id="oauthHost"]'));
    logoutUrlText = element(by.css('input[id="logout-url"]'));
    basicAuthRadioButton = element(by.cssContainingText('mat-radio-button[id*="mat-radio"]', 'Basic Authentication'));
    identityHostText = element(by.css('input[id="identityHost"]'));
    ssoRadioButton = element(by.cssContainingText('[id*="mat-radio"]', 'SSO'));
    silentLoginToggleLabel = element(by.css('mat-slide-toggle[name="silentLogin"] label'));
    silentLoginToggleElement = element(by.css('mat-slide-toggle[name="silentLogin"]'));
    implicitFlowLabel = element(by.css('mat-slide-toggle[name="implicitFlow"] label'));
    implicitFlowElement = element(by.css('mat-slide-toggle[name="implicitFlow"]'));
    applyButton = element(by.css('button[data-automation-id*="host-button"]'));
    backButton = element(by.cssContainingText('button span[class="mat-button-wrapper"]', 'Back'));
    validationMessage = element(by.cssContainingText('mat-error', 'This field is required'));

    async goToSettingsPage() {
        browser.waitForAngularEnabled(true);
        browser.driver.get(this.settingsURL);
        return BrowserVisibility.waitUntilElementIsVisible(this.providerDropdown);
    }

    async setProvider(option, selected) {
        await BrowserActions.click(this.providerDropdown);
        await BrowserActions.click(option);
        const selectedOptionText = await BrowserActions.getText(this.selectedOption)
        return expect(selectedOptionText).toEqual(selected);
    }

    async getSelectedOptionText(): Promise<string> {
        return BrowserActions.getText(this.selectedOption);
    }

    getBpmHostUrl() {
        return this.bpmText.getAttribute('value');
    }

    getEcmHostUrl() {
        return this.ecmText.getAttribute('value');
    }

    getBpmOption() {
        return this.bpm.option;
    }

    getEcmOption() {
        return this.ecm.option;
    }

    getEcmAndBpmOption() {
        return this.ecmAndBpm.option;
    }

    async setProviderEcmBpm() {
        this.setProvider(this.ecmAndBpm.option, this.ecmAndBpm.text);
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        this.clickApply();
        return this;
    }

    async setProviderBpm() {
        this.setProvider(this.bpm.option, this.bpm.text);
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        this.clickApply();
        return this;
    }

    async setProviderEcm() {
        this.setProvider(this.ecm.option, this.ecm.text);
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        expect(this.bpmText.isPresent()).toBeFalsy();
        this.clickApply();
        return this;
    }

    async setProviderOauth() {
        this.goToSettingsPage();
        this.setProvider(this.oauth.option, this.oauth.text);
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        expect(this.authHostText.isPresent()).toBeTruthy();
        this.clickApply();
        return this;
    }

    async clickBackButton() {
        await BrowserActions.click(this.backButton);
    }

    async clickSsoRadioButton() {
        await BrowserActions.click(this.ssoRadioButton);
    }

    async setProviderEcmSso(contentServiceURL, authHost, identityHost, silentLogin = true, implicitFlow = true, clientId?: string, logoutUr: string = '/logout') {
        await this.goToSettingsPage();
        this.setProvider(this.ecm.option, this.ecm.text);
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.bpmText);
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        this.clickSsoRadioButton();
        this.setContentServicesURL(contentServiceURL);
        this.setAuthHost(authHost);
        this.setIdentityHost(identityHost);
        this.setSilentLogin(silentLogin);
        this.setImplicitFlow(implicitFlow);
        this.setLogoutUrl(logoutUr);
        this.clickApply();
        await browser.sleep(1000);
    }

    async setProviderBpmSso(processServiceURL, authHost, identityHost, silentLogin = true, implicitFlow = true) {
        await this.goToSettingsPage();
        this.setProvider(this.bpm.option, this.bpm.text);
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.ecmText);
        this.clickSsoRadioButton();
        this.setClientId();
        this.setProcessServicesURL(processServiceURL);
        this.setAuthHost(authHost);
        this.setIdentityHost(identityHost);
        this.setSilentLogin(silentLogin);
        this.setImplicitFlow(implicitFlow);
        await this.clickApply();
        await browser.sleep(1000);
    }

    async setProviderEcmBpmSso(contentServicesURL: string, processServiceURL, authHost, identityHost, clientId: string, silentLogin = true, implicitFlow = true) {
        await this.goToSettingsPage();
        this.setProvider(this.ecmAndBpm.option, this.ecmAndBpm.text);
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        this.clickSsoRadioButton();
        this.setClientId(clientId);
        this.setContentServicesURL(contentServicesURL);
        this.setProcessServicesURL(processServiceURL);
        this.setAuthHost(authHost);
        this.setIdentityHost(identityHost);
        this.setSilentLogin(silentLogin);
        this.setImplicitFlow(implicitFlow);
        await this.clickApply();
        await browser.sleep(1000);
    }

    async setLogoutUrl(logoutUrl) {
        await BrowserVisibility.waitUntilElementIsPresent(this.logoutUrlText);
        this.logoutUrlText.clear();
        this.logoutUrlText.sendKeys(logoutUrl);
    }

    async setProcessServicesURL(processServiceURL) {
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        await BrowserActions.clearSendKeys(this.bpmText, processServiceURL);
    }

    async setClientId(clientId: string = browser.params.config.oauth2.clientId) {
        await BrowserVisibility.waitUntilElementIsVisible(this.clientIdText);
        this.clientIdText.clear();
        this.clientIdText.sendKeys(clientId);
    }

    async setContentServicesURL(contentServiceURL) {
        await BrowserVisibility.waitUntilElementIsClickable(this.ecmText);
        await BrowserActions.clearSendKeys(this.ecmText, contentServiceURL);
    }

    async clearContentServicesURL() {
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        this.ecmText.clear();
        this.ecmText.sendKeys('a');
        this.ecmText.sendKeys(protractor.Key.BACK_SPACE);
    }

    async clearProcessServicesURL() {
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        this.bpmText.clear();
        this.bpmText.sendKeys('a');
        this.bpmText.sendKeys(protractor.Key.BACK_SPACE);
    }

    async setAuthHost(authHostURL) {
        await BrowserVisibility.waitUntilElementIsVisible(this.authHostText);
        await this.authHostText.clear();
        await this.authHostText.sendKeys(authHostURL);
    }

    async setIdentityHost(identityHost) {
        await BrowserVisibility.waitUntilElementIsVisible(this.identityHostText);
        await this.identityHostText.clear();
        await this.identityHostText.sendKeys(identityHost);
    }

    async clickApply() {
        await BrowserActions.click(this.applyButton);
    }

    async setSilentLogin(enableToggle) {
        await BrowserVisibility.waitUntilElementIsVisible(this.silentLoginToggleElement);

        const isChecked = (await this.silentLoginToggleElement.getAttribute('class')).includes('mat-checked');

        if (isChecked && !enableToggle || !isChecked && enableToggle) {
            return await BrowserActions.click(this.silentLoginToggleLabel);

        }

        return Promise.resolve();
    }

    async setImplicitFlow(enableToggle) {
        await BrowserVisibility.waitUntilElementIsVisible(this.implicitFlowElement);

        const isChecked = (await this.implicitFlowElement.getAttribute('class')).includes('mat-checked');

        if (isChecked && !enableToggle || !isChecked && enableToggle) {
            return BrowserActions.click(this.implicitFlowLabel);
        }

        return Promise.resolve();
    }

    async checkApplyButtonIsDisabled() {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css('button[data-automation-id*="host-button"]:disabled')));
        return this;
    }

    async checkProviderDropdownIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.providerDropdown);
    }

    async checkValidationMessageIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.validationMessage);
    }

    async checkProviderOptions() {
        BrowserActions.click(this.providerDropdown);
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmAndBpm.option);
        await BrowserVisibility.waitUntilElementIsVisible(this.ecm.option);
        await BrowserVisibility.waitUntilElementIsVisible(this.bpm.option);
    }

    async getBasicAuthRadioButton() {
        await BrowserVisibility.waitUntilElementIsVisible(this.basicAuthRadioButton);
        return this.basicAuthRadioButton;
    }

    async getSsoRadioButton() {
        await BrowserVisibility.waitUntilElementIsVisible(this.ssoRadioButton);
        return this.ssoRadioButton;
    }

    async getBackButton() {
        await BrowserVisibility.waitUntilElementIsVisible(this.backButton);
        return this.backButton;
    }

    async getApplyButton() {
        await BrowserVisibility.waitUntilElementIsVisible(this.applyButton);
        return this.applyButton;
    }

    async checkBasicAuthRadioIsSelected() {
        const radioButton = await this.getBasicAuthRadioButton();
        expect(radioButton.getAttribute('class')).toContain('mat-radio-checked');
    }

    async checkSsoRadioIsNotSelected() {
        const radioButton = await this.getBasicAuthRadioButton();
        expect(radioButton.getAttribute('class')).not.toContain('mat-radio-checked');
    }
}
