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

import { element, by } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { TabsPage } from '../../material/pages/tabs.page';
import { BrowserActions } from '../utils/browser-actions';

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
        BrowserActions.click(this.userProfileButton);
    }

    clickOnContentServicesTab() {
        const tabsPage = new TabsPage();
        tabsPage.clickTabByTitle('Content Services');
        return this;
    }

    checkProcessServicesTabIsSelected() {
        const tabsPage = new TabsPage;
        tabsPage.checkTabIsSelectedByTitle('Process Services');
        return this;
    }

    clickOnProcessServicesTab() {
        const tabsPage = new TabsPage;
        tabsPage.clickTabByTitle('Process Services');
        return this;
    }

    userImageIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.userImage);
        return this;
    }

    getContentHeaderTitle() {
        BrowserVisibility.waitUntilElementIsVisible(this.dialog);
        return BrowserActions.getText(this.userInfoEcmHeaderTitle);
    }

    getContentTitle() {
        return BrowserActions.getText(this.userInfoEcmTitle);
    }

    getContentEmail() {
        return BrowserActions.getText(this.ecmEmail);
    }

    getContentJobTitle() {
        return BrowserActions.getText(this.ecmJobTitle);
    }

    getProcessHeaderTitle() {
        return BrowserActions.getText(this.userInfoProcessHeaderTitle);
    }

    getProcessTitle() {
        return BrowserActions.getText(this.userInfoProcessTitle);
    }

    getProcessEmail() {
        return BrowserActions.getText(this.processEmail);
    }

    getProcessTenant() {
        return BrowserActions.getText(this.processTenant);
    }

    getSsoHeaderTitle() {
        return BrowserActions.getText(this.userInfoSsoHeaderTitle);
    }

    getSsoTitle() {
        return BrowserActions.getText(this.userInfoSsoTitle);
    }

    getSsoEmail() {
        return BrowserActions.getText(this.ssoEmail);
    }

    closeUserProfile() {
        BrowserVisibility.waitUntilElementIsVisible(this.dialog);
        BrowserActions.closeMenuAndDialogs();
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
