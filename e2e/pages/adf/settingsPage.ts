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

import TestConfig = require('../../test.config');
import Util = require('../../util/util');

export class SettingsPage {

    settingsURL = TestConfig.adf.url + TestConfig.adf.port + '/settings';
    providerDropdown = element(by.css('mat-select[aria-label="Provider"] div[class="mat-select-arrow-wrapper"]'));
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
    selectedOption = element.all(by.css('span[class*="ng-star-inserted"]')).first();
    ecmText = element(by.css('input[data-automation-id*="ecmHost"]'));
    bpmText = element(by.css('input[data-automation-id*="bpmHost"]'));
    authHostText = element(by.css('input[id="oauthHost"]'));
    applyButton = element(by.css('button[data-automation-id*="host-button"]'));

    goToSettingsPage() {
        browser.driver.get(this.settingsURL);
        Util.waitUntilElementIsVisible(this.providerDropdown);
        return this;
    }

    setProvider(option, selected) {
        Util.waitUntilElementIsVisible(this.providerDropdown);
        this.providerDropdown.click();
        Util.waitUntilElementIsVisible(option);
        option.click();
        return expect(this.selectedOption.getText()).toEqual(selected);
    }

    setProviderEcmBpm() {
        this.goToSettingsPage();
        this.setProvider(this.ecmAndBpm.option, this.ecmAndBpm.text);
        Util.waitUntilElementIsVisible(this.bpmText);
        Util.waitUntilElementIsVisible(this.ecmText);
        this.clickApply();
        return this;
    }

    setProviderBpm() {
        this.goToSettingsPage();
        this.setProvider(this.bpm.option, this.bpm.text);
        Util.waitUntilElementIsVisible(this.bpmText);
        expect(this.ecmText.isPresent()).toBe(false);
        this.clickApply();
        return this;
    }

    setProviderEcm() {
        this.goToSettingsPage();
        this.setProvider(this.ecm.option, this.ecm.text);
        Util.waitUntilElementIsVisible(this.ecmText);
        expect(this.bpmText.isPresent()).toBe(false);
        this.clickApply();
        return this;
    }

    setProviderOauth() {
        this.goToSettingsPage();
        this.setProvider(this.oauth.option, this.oauth.text);
        Util.waitUntilElementIsVisible(this.bpmText);
        Util.waitUntilElementIsVisible(this.ecmText);
        expect(this.authHostText.isPresent()).toBe(true);
        this.clickApply();
        return this;
    }

    clickApply() {
        Util.waitUntilElementIsVisible(this.applyButton);
        this.applyButton.click();
    }

    checkProviderDropdownIsDisplayed() {
        Util.waitUntilElementIsVisible(this.providerDropdown);
    }
}
