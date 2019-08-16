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
import { ElementFinder } from 'protractor';

export class UserInfoPage {

    dialog: ElementFinder = element.all(by.css('mat-card[class*="adf-userinfo-card"]')).first();
    userImage: ElementFinder = element(by.css('div[id="user-initial-image"]'));
    userInfoEcmHeaderTitle: ElementFinder = element(by.css('div[id="ecm-username"]'));
    userInfoEcmTitle: ElementFinder = element(by.css('mat-card-content span[id="ecm-full-name"]'));
    ecmEmail: ElementFinder = element(by.css('span[id="ecm-email"]'));
    ecmJobTitle: ElementFinder = element(by.css('span[id="ecm-job-title"]'));
    userInfoProcessHeaderTitle: ElementFinder = element(by.css('div[id="bpm-username"]'));
    userInfoProcessTitle: ElementFinder = element(by.css('mat-card-content span[id="bpm-full-name"]'));
    processEmail: ElementFinder = element(by.css('span[id="bpm-email"]'));
    processTenant: ElementFinder = element(by.css('span[class="detail-profile"]'));
    apsImage: ElementFinder = element(by.css('img[id="bpm-user-detail-image"]'));
    acsImage: ElementFinder = element(by.css('img[id="ecm-user-detail-image"]'));
    initialImage: ElementFinder = element.all(by.css('div[id="user-initials-image"]')).first();
    userInfoSsoHeaderTitle: ElementFinder = this.dialog.element(by.css('div[id="identity-username"]'));
    userInfoSsoTitle: ElementFinder = element(by.css('.adf-userinfo__detail-title'));
    ssoEmail: ElementFinder = element(by.id('identity-email'));
    userProfileButton: ElementFinder = element(by.css('button[data-automation-id="adf-user-profile"]'));

    async dialogIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dialog);
    }

    async dialogIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.dialog);
    }

    async clickUserProfile(): Promise<void> {
        await BrowserActions.click(this.userProfileButton);
    }

    async clickOnContentServicesTab(): Promise<void> {
        const tabsPage = new TabsPage();
        await tabsPage.clickTabByTitle('Content Services');
    }

    async checkProcessServicesTabIsSelected(): Promise<void> {
        const tabsPage = new TabsPage;
        await tabsPage.checkTabIsSelectedByTitle('Process Services');
    }

    async clickOnProcessServicesTab(): Promise<void> {
        const tabsPage = new TabsPage;
        await tabsPage.clickTabByTitle('Process Services');
    }

    async userImageIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.userImage);
    }

    async getContentHeaderTitle(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dialog);
        return BrowserActions.getText(this.userInfoEcmHeaderTitle);
    }

    async getContentTitle(): Promise<string> {
        return BrowserActions.getText(this.userInfoEcmTitle);
    }

    async getContentEmail(): Promise<string> {
        return BrowserActions.getText(this.ecmEmail);
    }

    async getContentJobTitle(): Promise<string> {
        return BrowserActions.getText(this.ecmJobTitle);
    }

    async getProcessHeaderTitle(): Promise<string> {
        return BrowserActions.getText(this.userInfoProcessHeaderTitle);
    }

    async getProcessTitle(): Promise<string> {
        return BrowserActions.getText(this.userInfoProcessTitle);
    }

    async getProcessEmail(): Promise<string> {
        return BrowserActions.getText(this.processEmail);
    }

    async getProcessTenant(): Promise<string> {
        return BrowserActions.getText(this.processTenant);
    }

    async getSsoHeaderTitle(): Promise<string> {
        return BrowserActions.getText(this.userInfoSsoHeaderTitle);
    }

    async getSsoTitle(): Promise<string> {
        return BrowserActions.getText(this.userInfoSsoTitle);
    }

    async getSsoEmail(): Promise<string> {
        return BrowserActions.getText(this.ssoEmail);
    }

    async closeUserProfile(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dialog);
        await BrowserActions.closeMenuAndDialogs();
    }

    async checkACSProfileImage(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.acsImage);
    }

    async checkAPSProfileImage(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.apsImage);
    }

    async checkInitialImage(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.initialImage);
    }

    async initialImageNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.initialImage);
    }

    async ACSProfileImageNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.acsImage);
    }

    async APSProfileImageNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.apsImage);
    }

}
