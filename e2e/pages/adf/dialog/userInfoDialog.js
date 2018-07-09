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

var Util = require('../../../util/util');

var UserInfoDialog = function () {

    var dialog = element(by.css("mat-card[class*='adf-userinfo-card']"));
    var contentServicesTab = element(by.css("div[id*='mat-tab-label-0-0']"));
    var processServicesTab = element(by.css("div[id*='mat-tab-label-0-1']"));
    var userImage = element(by.css("div[id='user-initial-image']"));
    var userInfoEcmHeaderTitle = element(by.css("div[id='ecm-username']"));
    var userInfoEcmTitle = element(by.css("mat-card-content span[id='ecm-full-name']"));
    var ecmEmail = element(by.css("span[id='ecm-email']"));
    var ecmJobTitle = element(by.css("span[id='ecm-job-title']"));
    var userInfoProcessHeaderTitle = element(by.css("div[id='bpm-username']"));
    var userInfoProcessTitle = element(by.css("mat-card-content span[id='bpm-full-name']"));
    var processEmail = element(by.css("span[id='bpm-email']"));
    var processTenant = element(by.css("span[class='detail-profile']"));
    var apsImage = element(by.css("img[id='bpm-user-detail-image']"));
    var acsImage = element(by.css("img[id='ecm-user-detail-image']"));
    var initialImage = element.all(by.css("div[id='user-initials-image']")).first();

    this.dialogIsDisplayed = function () {
        Util.waitUntilElementIsVisible(dialog);
        return this;
    };

    this.dialogIsNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(dialog);
        return this;
    };

    this.contentServicesTabIsDisplayed = function () {
        Util.waitUntilElementIsVisible(contentServicesTab);
        return this;
    };

    this.contentServicesTabIsNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(contentServicesTab);
        return this;
    };

    this.clickOnContentServicesTab = function () {
        this.contentServicesTabIsDisplayed();
        contentServicesTab.click();
        return this;
    };

    this.processServicesTabIsDisplayed = function () {
        Util.waitUntilElementIsVisible(processServicesTab);
        return this;
    };

    this.processServicesTabIsNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(processServicesTab);
        return this;
    };

    this.clickOnProcessServicesTab = function () {
        this.processServicesTabIsDisplayed();
        processServicesTab.click();
        return this;
    };

    this.userImageIsDisplayed = function () {
        Util.waitUntilElementIsVisible(userImage);
        return this;
    };

    this.getContentHeaderTitle = function () {
        Util.waitUntilElementIsVisible(userInfoEcmHeaderTitle);
        return userInfoEcmHeaderTitle.getText();
    };

    this.getContentTitle = function () {
        Util.waitUntilElementIsVisible(userInfoEcmTitle);
        return userInfoEcmTitle.getText();
    };

    this.getContentEmail = function () {
        Util.waitUntilElementIsVisible(ecmEmail);
        return ecmEmail.getText();
    };

    this.getContentJobTitle = function () {
        Util.waitUntilElementIsVisible(ecmJobTitle);
        return ecmJobTitle.getText();
    };

    this.getProcessHeaderTitle = function () {
        Util.waitUntilElementIsVisible(userInfoProcessHeaderTitle);
        return userInfoProcessHeaderTitle.getText();
    };

    this.getProcessTitle = function () {
        Util.waitUntilElementIsVisible(userInfoProcessTitle);
        return userInfoProcessTitle.getText();
    };

    this.getProcessEmail = function () {
        Util.waitUntilElementIsVisible(processEmail);
        return processEmail.getText();
    };

    this.getProcessTenant = function () {
        Util.waitUntilElementIsVisible(processTenant);
        return processTenant.getText();
    };

    this.closeUserProfile = function () {
        Util.waitUntilElementIsVisible(dialog);
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    };

    this.checkACSProfileImage = function () {
        Util.waitUntilElementIsVisible(acsImage);
    };

    this.checkAPSProfileImage = function () {
        Util.waitUntilElementIsVisible(apsImage);
    };

    this.checkInitialImage = function () {
        Util.waitUntilElementIsVisible(initialImage);
    };

    this.initialImageNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(initialImage);
    };

    this.ACSProfileImageNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(acsImage);
    };

    this.APSProfileImageNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(apsImage);
    };
};
module.exports = UserInfoDialog;
