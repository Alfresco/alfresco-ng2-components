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

import Util = require('../../../util/util');
import { TabsPage } from '../material/tabsPage';
import { element, by, browser, protractor } from 'protractor';

export class UserInfoDialog {

    dialog = element(by.css('mat-card[class*="adf-userinfo-card"]'));
    userImage = element(by.css('div[id="user-initial-image"]'));
    userInfoEcmHeaderTitle = element(by.css('div[id="ecm-username"]'));
    userInfoEcmTitle = element(by.css('mat-card-content span[id="ecm-full-name"]'));
    ecmEmail = element(by.css('span[id="ecm-email"]'));
    ecmJobTitle = element(by.css('span[id="ecm-job-title"]'));
    userInfoProcessHeaderTitle = element(by.css('div[id="bpm-username"]'));
    userInfoProcessTitle = element(by.css('mat-card-content span[id="bpm-full-name"]'));
    processEmail = element(by.css('span[id="bpm-email"]'));
    processTenant = element(by.css('span[class="detail-profile"]'));
    apsImage = element(by.css('img[id="bpm-user-detail-image"]'));
    acsImage = element(by.css('img[id="ecm-user-detail-image"]'));
    initialImage = element.all(by.css('div[id="user-initials-image"]')).first();

    dialogIsDisplayed() {
        Util.waitUntilElementIsVisible(this.dialog);
        return this;
    }

    dialogIsNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.dialog);
        return this;
    }

    clickOnContentServicesTab() {
        let tabsPage = new TabsPage;
        tabsPage.clickTabByTitle('Content Services');
        return this;
    }

    clickOnProcessServicesTab() {
        let tabsPage = new TabsPage;
        tabsPage.clickTabByTitle('Process Services');
        return this;
    }

    userImageIsDisplayed() {
        Util.waitUntilElementIsVisible(this.userImage);
        return this;
    }

    getContentHeaderTitle() {
        Util.waitUntilElementIsVisible(this.dialog);
        Util.waitUntilElementIsVisible(this.userInfoEcmHeaderTitle);
        return this.userInfoEcmHeaderTitle.getText();
    }

    getContentTitle() {
        Util.waitUntilElementIsVisible(this.userInfoEcmTitle);
        return this.userInfoEcmTitle.getText();
    }

    getContentEmail() {
        Util.waitUntilElementIsVisible(this.ecmEmail);
        return this.ecmEmail.getText();
    }

    getContentJobTitle() {
        Util.waitUntilElementIsVisible(this.ecmJobTitle);
        return this.ecmJobTitle.getText();
    }

    getProcessHeaderTitle() {
        Util.waitUntilElementIsVisible(this.userInfoProcessHeaderTitle);
        return this.userInfoProcessHeaderTitle.getText();
    }

    getProcessTitle() {
        Util.waitUntilElementIsVisible(this.userInfoProcessTitle);
        return this.userInfoProcessTitle.getText();
    }

    getProcessEmail() {
        Util.waitUntilElementIsVisible(this.processEmail);
        return this.processEmail.getText();
    }

    getProcessTenant() {
        Util.waitUntilElementIsVisible(this.processTenant);
        return this.processTenant.getText();
    }

    closeUserProfile() {
        Util.waitUntilElementIsVisible(this.dialog);
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    }

    checkACSProfileImage() {
        Util.waitUntilElementIsVisible(this.acsImage);
    }

    checkAPSProfileImage() {
        Util.waitUntilElementIsVisible(this.apsImage);
    }

    checkInitialImage() {
        Util.waitUntilElementIsVisible(this.initialImage);
    }

    initialImageNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.initialImage);
    }

    ACSProfileImageNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.acsImage);
    }

    APSProfileImageNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.apsImage);
    }
}
