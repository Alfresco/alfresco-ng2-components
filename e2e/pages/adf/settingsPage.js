/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

var TestConfig = require('../../test.config');
var Util = require('../../util/util');

var SettingsPage = function () {

    var settingsURL = TestConfig.adf.url + TestConfig.adf.port + "/settings";
    var providerDropdown = element(by.css("mat-select[aria-label='Provider'] div[class='mat-select-arrow-wrapper']"));
    var ecmAndBpm = {
        option: element(by.xpath("//SPAN[@class='mat-option-text'][contains(text(),'ALL')]")),
        text: "ALL"
    };
    var bpm = {
        option: element(by.xpath("//SPAN[@class='mat-option-text'][contains(text(),'BPM') and not (contains(text(),'and'))]")),
        text: "BPM"
    };
    var ecm = {
        option: element(by.xpath("//SPAN[@class='mat-option-text'][contains(text(),'ECM') and not (contains(text(),'and'))]")),
        text: "ECM"
    };
    var oauth = {
        option: element(by.xpath("//SPAN[@class='mat-option-text'][contains(text(),'OAUTH')]")),
        text: "OAUTH"
    };
    var selectedOption = element.all(by.css("span[class*='ng-star-inserted']")).first();
    var ecmText = element(by.css("input[data-automation-id*='ecmHost']"));
    var bpmText = element(by.css("input[data-automation-id*='bpmHost']"));
    var authHostText = element(by.css("input[id='oauthHost']"));
    var silentLoginToggle = element(by.css("mat-slide-toggle[name='silentLogin'] div[class='mat-slide-toggle-thumb']"));
    var silentLoginEnabled = element(by.css("mat-slide-toggle[class*='mat-checked'][name='silentLogin'] div[class='mat-slide-toggle-thumb']"));
    var backButton = element(by.cssContainingText("span[class='mat-button-wrapper']", "Back"));
    var applyButton = element(by.css("button[data-automation-id*='host-button']"));

    this.goToSettingsPage = function () {
        browser.driver.get(settingsURL);
        Util.waitUntilElementIsVisible(providerDropdown);
        return this;
    };

    /**
     * Selects provider
     * @method setProvider
     * @param {String} option, {String} selected
     */
    this.setProvider = function (option, selected) {
        Util.waitUntilElementIsVisible(providerDropdown);
        providerDropdown.click();
        Util.waitUntilElementIsVisible(option);
        option.click();
        return expect(selectedOption.getText()).toEqual(selected);
    };

    /**
     * Sets provider as ECM and BPM
     * @method setProviderEcmBpm
     */
    this.setProviderEcmBpm = function () {
        this.goToSettingsPage();
        this.setProvider(ecmAndBpm.option, ecmAndBpm.text);
        Util.waitUntilElementIsVisible(bpmText);
        Util.waitUntilElementIsVisible(ecmText);
        this.clickApply();
        return this;
    };

    /**
     * Sets provider as BPM
     * @method setProviderBpm
     */
    this.setProviderBpm = function () {
        this.goToSettingsPage();
        this.setProvider(bpm.option, bpm.text);
        Util.waitUntilElementIsVisible(bpmText);
        expect(ecmText.isPresent()).toBe(false);
        this.clickApply();
        return this;
    };

    /**
     * Sets provider as ECM
     * @method setProviderEcm
     */
    this.setProviderEcm = function () {
        this.goToSettingsPage();
        this.setProvider(ecm.option, ecm.text);
        Util.waitUntilElementIsVisible(ecmText);
        expect(bpmText.isPresent()).toBe(false);
        this.clickApply();
        return this;
    };

    /**
     * Sets provider as OAUTH
     * @method setProviderOauth
     */
    this.setProviderOauth = function () {
        this.goToSettingsPage();
        this.setProvider(oauth.option, oauth.text);
        Util.waitUntilElementIsVisible(bpmText);
        Util.waitUntilElementIsVisible(ecmText);
        expect(authHostText.isPresent()).toBe(true);
        this.clickApply();
        return this;
    };

    /**
     * Clicks Apply button
     * @method clickApply
     */
    this.clickApply = function () {
        Util.waitUntilElementIsVisible(applyButton);
        applyButton.click();
    };

    this.checkProviderDropdownIsDisplayed = function () {
        Util.waitUntilElementIsVisible(providerDropdown);
    };
};
module.exports = SettingsPage;
