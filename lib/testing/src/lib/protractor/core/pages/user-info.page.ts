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

import { $, $$ } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { TabsPage } from '../../core/pages/material/tabs.page';
import { BrowserActions } from '../utils/browser-actions';

export class UserInfoPage {

    dialog = $$('mat-card[class*="adf-userinfo-card"]').first();
    userImage = $('div[id="user-initial-image"]');
    userInfoEcmHeaderTitle = $('div[id="ecm-username"]');
    userInfoEcmTitle = $('mat-card-content span[id="ecm-full-name"]');
    ecmEmail = $('span[id="ecm-email"]');
    ecmJobTitle = $('span[id="ecm-job-title"]');
    userInfoProcessHeaderTitle = $('div[id="bpm-username"]');
    userInfoProcessTitle = $('mat-card-content span[id="bpm-full-name"]');
    processEmail = $('span[id="bpm-email"]');
    processTenant = $('.detail-profile');
    apsImage = $('img[id="bpm-user-detail-image"]');
    acsImage = $('img[id="ecm-user-detail-image"]');
    initialImage = $$('div[data-automation-id="user-initials-image"]').first();
    userInfoSsoHeaderTitle = this.dialog.$('div[id="identity-username"]');
    userInfoSsoTitle = $('.adf-userinfo__detail-title');
    ssoEmail = $('#identity-email');
    userProfileButton = $('button[data-automation-id="adf-user-profile"]');
    tabsPage = new TabsPage();

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
        await this.tabsPage.clickTabByTitle('Content Services');
    }

    async checkProcessServicesTabIsSelected(): Promise<void> {
        await this.tabsPage.checkTabIsSelectedByTitle('Process Services');
    }

    async checkContentServicesTabIsSelected(): Promise<void> {
        await this.tabsPage.checkTabIsSelectedByTitle('Content Services');
    }

    async clickOnProcessServicesTab(): Promise<void> {
        await this.tabsPage.clickTabByTitle('Process Services');
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

    // eslint-disable-next-line @typescript-eslint/naming-convention
    async ACSProfileImageNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.acsImage);
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    async APSProfileImageNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.apsImage);
    }

}
