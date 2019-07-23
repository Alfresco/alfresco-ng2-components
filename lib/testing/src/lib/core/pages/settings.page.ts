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
import { ElementFinder } from 'protractor/built/element';

export class SettingsPage {

    settingsURL: string = browser.baseUrl + '/settings';
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
    selectedOption: ElementFinder = element(by.css('span[class*="mat-select-value-text"]'));
    ecmText: ElementFinder = element(by.css('input[data-automation-id*="ecmHost"]'));
    bpmText: ElementFinder = element(by.css('input[data-automation-id*="bpmHost"]'));
    clientIdText: ElementFinder = element(by.css('input[id="clientId"]'));
    authHostText: ElementFinder = element(by.css('input[id="oauthHost"]'));
    logoutUrlText: ElementFinder = element(by.css('input[id="logout-url"]'));
    basicAuthRadioButton: ElementFinder = element(by.cssContainingText('mat-radio-button[id*="mat-radio"]', 'Basic Authentication'));
    identityHostText: ElementFinder = element(by.css('input[id="identityHost"]'));
    ssoRadioButton: ElementFinder = element(by.cssContainingText('[id*="mat-radio"]', 'SSO'));
    silentLoginToggleLabel: ElementFinder = element(by.css('mat-slide-toggle[name="silentLogin"] label'));
    silentLoginToggleElement: ElementFinder = element(by.css('mat-slide-toggle[name="silentLogin"]'));
    implicitFlowLabel: ElementFinder = element(by.css('mat-slide-toggle[name="implicitFlow"] label'));
    implicitFlowElement: ElementFinder = element(by.css('mat-slide-toggle[name="implicitFlow"]'));
    applyButton: ElementFinder = element(by.css('button[data-automation-id*="host-button"]'));
    backButton: ElementFinder = element(by.cssContainingText('button span[class="mat-button-wrapper"]', 'Back'));
    validationMessage: ElementFinder = element(by.cssContainingText('mat-error', 'This field is required'));

    async goToSettingsPage(): Promise<void> {
        await browser.driver.get(this.settingsURL);
        await BrowserVisibility.waitUntilElementIsVisible(this.providerDropdown);
    }

    async setProvider(option, selected): Promise<void> {
        await BrowserActions.click(this.providerDropdown);
        await BrowserActions.click(option);
        const selectedOptionText = await BrowserActions.getText(this.selectedOption);
        expect(selectedOptionText).toEqual(selected);
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
        await this.setProvider(this.ecmAndBpm.option, this.ecmAndBpm.text);
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        await this.clickApply();
    }

    async setProviderBpm() {
        await this.setProvider(this.bpm.option, this.bpm.text);
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        await this.clickApply();
    }

    async setProviderEcm() {
        await this.setProvider(this.ecm.option, this.ecm.text);
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        expect(await this.bpmText.isPresent()).toBe(false, 'Bpm text is present');
        await this.clickApply();
    }

    async setProviderOauth() {
        await this.goToSettingsPage();
        await this.setProvider(this.oauth.option, this.oauth.text);
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        expect(await this.authHostText.isPresent()).toBe(true, 'Auth Host text not present');
        await this.clickApply();
    }

    async clickBackButton() {
        await BrowserActions.click(this.backButton);
    }

    async clickSsoRadioButton() {
        await BrowserActions.click(this.ssoRadioButton);
    }

    async setProviderEcmSso(contentServiceURL, authHost, identityHost, silentLogin = true, implicitFlow = true, clientId?: string, logoutUr: string = '/logout') {
        await this.goToSettingsPage();
        await this.setProvider(this.ecm.option, this.ecm.text);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.bpmText);
        await BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        await this.clickSsoRadioButton();
        await this.setContentServicesURL(contentServiceURL);
        await this.setAuthHost(authHost);
        await this.setIdentityHost(identityHost);
        await this.setSilentLogin(silentLogin);
        await this.setImplicitFlow(implicitFlow);
        await this.setLogoutUrl(logoutUr);
        await this.clickApply();
        await browser.sleep(1000);
    }

    async setProviderBpmSso(processServiceURL, authHost, identityHost, silentLogin = true, implicitFlow = true) {
        await this.goToSettingsPage();
        await this.setProvider(this.bpm.option, this.bpm.text);
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
        await this.setProvider(this.ecmAndBpm.option, this.ecmAndBpm.text);
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
        await this.ecmText.clear();
        await this.ecmText.sendKeys('a');
        await this.ecmText.sendKeys(protractor.Key.BACK_SPACE);
    }

    async clearProcessServicesURL() {
        await BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        await this.bpmText.clear();
        await this.bpmText.sendKeys('a');
        await this.bpmText.sendKeys(protractor.Key.BACK_SPACE);
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
            await BrowserActions.click(this.implicitFlowLabel);
        }

        return Promise.resolve();
    }

    async checkApplyButtonIsDisabled() {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css('button[data-automation-id*="host-button"]:disabled')));
    }

    async checkProviderDropdownIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.providerDropdown);
    }

    async checkValidationMessageIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.validationMessage);
    }

    async checkProviderOptions() {
        await BrowserActions.click(this.providerDropdown);
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
