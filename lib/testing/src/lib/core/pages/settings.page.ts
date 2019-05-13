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

    goToSettingsPage() {
        browser.waitForAngularEnabled(true);
        browser.driver.get(this.settingsURL);
        BrowserVisibility.waitUntilElementIsVisible(this.providerDropdown);
        return this;
    }

    setProvider(option, selected) {
        BrowserVisibility.waitUntilElementIsVisible(this.providerDropdown);
        this.providerDropdown.click();
        BrowserVisibility.waitUntilElementIsVisible(option);
        option.click();
        return expect(this.selectedOption.getText()).toEqual(selected);
    }

    getSelectedOptionText() {
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

    setProviderEcmBpm() {
        this.setProvider(this.ecmAndBpm.option, this.ecmAndBpm.text);
        BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        this.clickApply();
        return this;
    }

    setProviderBpm() {
        this.setProvider(this.bpm.option, this.bpm.text);
        BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        this.clickApply();
        return this;
    }

    setProviderEcm() {
        this.setProvider(this.ecm.option, this.ecm.text);
        BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        expect(this.bpmText.isPresent()).toBeFalsy();
        this.clickApply();
        return this;
    }

    setProviderOauth() {
        this.goToSettingsPage();
        this.setProvider(this.oauth.option, this.oauth.text);
        BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        expect(this.authHostText.isPresent()).toBeTruthy();
        this.clickApply();
        return this;
    }

    async clickBackButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.backButton);
        await this.backButton.click();
    }

    async clickSsoRadioButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.ssoRadioButton);
        await this.ssoRadioButton.click();
    }

    async setProviderEcmSso(contentServiceURL, authHost, identityHost, silentLogin = true, implicitFlow = true, clientId?: string, logoutUr: string = '/logout') {
        this.goToSettingsPage();
        this.setProvider(this.ecm.option, this.ecm.text);
        BrowserVisibility.waitUntilElementIsNotOnPage(this.bpmText);
        BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        this.clickSsoRadioButton();
        this.setContentServicesURL(contentServiceURL);
        this.setAuthHost(authHost);
        this.setIdentityHost(identityHost);
        this.setSilentLogin(silentLogin);
        this.setImplicitFlow(implicitFlow);
        this.setLogoutUrl(logoutUr);
        this.clickApply();
        browser.sleep(1000);
    }

    async setProviderBpmSso(processServiceURL, authHost, identityHost, silentLogin = true, implicitFlow = true) {
        this.goToSettingsPage();
        this.setProvider(this.bpm.option, this.bpm.text);
        BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        BrowserVisibility.waitUntilElementIsNotOnPage(this.ecmText);
        this.clickSsoRadioButton();
        this.setClientId();
        this.setProcessServicesURL(processServiceURL);
        this.setAuthHost(authHost);
        this.setIdentityHost(identityHost);
        this.setSilentLogin(silentLogin);
        this.setImplicitFlow(implicitFlow);
        this.clickApply();
        browser.sleep(1000);
    }

    async setLogoutUrl(logoutUrl) {
        BrowserVisibility.waitUntilElementIsPresent(this.logoutUrlText);
        this.logoutUrlText.clear();
        this.logoutUrlText.sendKeys(logoutUrl);
    }

    async setProcessServicesURL(processServiceURL) {
        BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        BrowserActions.clearSendKeys(this.bpmText, processServiceURL);
    }

    async setClientId(clientId: string = browser.params.config.oauth2.clientId) {
        BrowserVisibility.waitUntilElementIsVisible(this.clientIdText);
        this.clientIdText.clear();
        this.clientIdText.sendKeys(clientId);
    }

    async setContentServicesURL(contentServiceURL) {
        BrowserVisibility.waitUntilElementIsClickable(this.ecmText);
        BrowserActions.clearSendKeys(this.ecmText, contentServiceURL);
    }

    clearContentServicesURL() {
        BrowserVisibility.waitUntilElementIsVisible(this.ecmText);
        this.ecmText.clear();
        this.ecmText.sendKeys('a');
        this.ecmText.sendKeys(protractor.Key.BACK_SPACE);
    }

    clearProcessServicesURL() {
        BrowserVisibility.waitUntilElementIsVisible(this.bpmText);
        this.bpmText.clear();
        this.bpmText.sendKeys('a');
        this.bpmText.sendKeys(protractor.Key.BACK_SPACE);
    }

    async setAuthHost(authHostURL) {
        BrowserVisibility.waitUntilElementIsVisible(this.authHostText);
        await this.authHostText.clear();
        await this.authHostText.sendKeys(authHostURL);
    }

    async setIdentityHost(identityHost) {
        BrowserVisibility.waitUntilElementIsVisible(this.identityHostText);
        await this.identityHostText.clear();
        await this.identityHostText.sendKeys(identityHost);
    }

    async clickApply() {
        BrowserVisibility.waitUntilElementIsVisible(this.applyButton);
        await this.applyButton.click();
    }

    async setSilentLogin(enableToggle) {
        BrowserVisibility.waitUntilElementIsVisible(this.silentLoginToggleElement);

        const isChecked = (await this.silentLoginToggleElement.getAttribute('class')).includes('mat-checked');

        if (isChecked && !enableToggle || !isChecked && enableToggle) {
            return this.silentLoginToggleLabel.click();
        }

        return Promise.resolve();
    }

    async setImplicitFlow(enableToggle) {
        BrowserVisibility.waitUntilElementIsVisible(this.implicitFlowElement);

        const isChecked = (await this.implicitFlowElement.getAttribute('class')).includes('mat-checked');

        if (isChecked && !enableToggle || !isChecked && enableToggle) {
            return this.implicitFlowLabel.click();
        }

        return Promise.resolve();
    }

    checkApplyButtonIsDisabled() {
        BrowserVisibility.waitUntilElementIsVisible(element(by.css('button[data-automation-id*="host-button"]:disabled')));
        return this;
    }

    checkProviderDropdownIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.providerDropdown);
    }

    checkValidationMessageIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.validationMessage);
    }

    checkProviderOptions() {
        BrowserVisibility.waitUntilElementIsVisible(this.providerDropdown);
        this.providerDropdown.click();
        BrowserVisibility.waitUntilElementIsVisible(this.ecmAndBpm.option);
        BrowserVisibility.waitUntilElementIsVisible(this.ecm.option);
        BrowserVisibility.waitUntilElementIsVisible(this.bpm.option);
    }

    getBasicAuthRadioButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.basicAuthRadioButton);
        return this.basicAuthRadioButton;
    }

    getSsoRadioButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.ssoRadioButton);
        return this.ssoRadioButton;
    }

    getBackButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.backButton);
        return this.backButton;
    }

    getApplyButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.applyButton);
        return this.applyButton;
    }

    checkBasicAuthRadioIsSelected() {
        expect(this.getBasicAuthRadioButton().getAttribute('class')).toContain('mat-radio-checked');
    }

    checkSsoRadioIsNotSelected() {
        expect(this.getSsoRadioButton().getAttribute('class')).not.toContain('mat-radio-checked');
    }
}
