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

import { element, by, browser, protractor } from 'protractor';
import { BrowserVisibility } from '../browser-visibility';
import { TabsPage } from '../material/tabs.page';

export class UserInfoPage {

    dialog = element.all(by.css('mat-card[class*="adf-userinfo-card"]')).first();
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
    userInfoSsoHeaderTitle = this.dialog.element(by.css('div[id="identity-username"]'));
    userInfoSsoTitle = element(by.css('.adf-userinfo__detail-title'));
    ssoEmail = element(by.id('identity-email'));
    userProfileButton = element(by.css('button[data-automation-id="adf-user-profile"]'));

    dialogIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.dialog);
        return this;
    }

    dialogIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.dialog);
        return this;
    }

    clickUserProfile() {
        BrowserVisibility.waitUntilElementIsVisible(this.userProfileButton);
        this.userProfileButton.click();
    }

    clickOnContentServicesTab() {
        let tabsPage = new TabsPage();
        tabsPage.clickTabByTitle('Content Services');
        return this;
    }

    checkProcessServicesTabIsSelected() {
        let tabsPage = new TabsPage;
        tabsPage.checkTabIsSelectedByTitle('Process Services');
        return this;
    }

    clickOnProcessServicesTab() {
        let tabsPage = new TabsPage;
        tabsPage.clickTabByTitle('Process Services');
        return this;
    }

    userImageIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.userImage);
        return this;
    }

    getContentHeaderTitle() {
        BrowserVisibility.waitUntilElementIsVisible(this.dialog);
        BrowserVisibility.waitUntilElementIsVisible(this.userInfoEcmHeaderTitle);
        return this.userInfoEcmHeaderTitle.getText();
    }

    getContentTitle() {
        BrowserVisibility.waitUntilElementIsVisible(this.userInfoEcmTitle);
        return this.userInfoEcmTitle.getText();
    }

    getContentEmail() {
        BrowserVisibility.waitUntilElementIsVisible(this.ecmEmail);
        return this.ecmEmail.getText();
    }

    getContentJobTitle() {
        BrowserVisibility.waitUntilElementIsVisible(this.ecmJobTitle);
        return this.ecmJobTitle.getText();
    }

    getProcessHeaderTitle() {
        BrowserVisibility.waitUntilElementIsVisible(this.userInfoProcessHeaderTitle);
        return this.userInfoProcessHeaderTitle.getText();
    }

    getProcessTitle() {
        BrowserVisibility.waitUntilElementIsVisible(this.userInfoProcessTitle);
        return this.userInfoProcessTitle.getText();
    }

    getProcessEmail() {
        BrowserVisibility.waitUntilElementIsVisible(this.processEmail);
        return this.processEmail.getText();
    }

    getProcessTenant() {
        BrowserVisibility.waitUntilElementIsVisible(this.processTenant);
        return this.processTenant.getText();
    }

    getSsoHeaderTitle () {
        BrowserVisibility.waitUntilElementIsVisible(this.userInfoSsoHeaderTitle);
        return this.userInfoSsoHeaderTitle.getText();
    }

    getSsoTitle() {
        BrowserVisibility.waitUntilElementIsVisible(this.userInfoSsoTitle);
        return this.userInfoSsoTitle.getText();
    }

    getSsoEmail() {
        BrowserVisibility.waitUntilElementIsVisible(this.ssoEmail);
        return this.ssoEmail.getText();
    }

    closeUserProfile() {
        BrowserVisibility.waitUntilElementIsVisible(this.dialog);
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    }

    checkACSProfileImage() {
        BrowserVisibility.waitUntilElementIsVisible(this.acsImage);
    }

    checkAPSProfileImage() {
        BrowserVisibility.waitUntilElementIsVisible(this.apsImage);
    }

    checkInitialImage() {
        BrowserVisibility.waitUntilElementIsVisible(this.initialImage);
    }

    initialImageNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.initialImage);
    }

    ACSProfileImageNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.acsImage);
    }

    APSProfileImageNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.apsImage);
    }

}
