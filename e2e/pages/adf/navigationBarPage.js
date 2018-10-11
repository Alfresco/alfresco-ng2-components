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

var Util = require('../../util/util');
var TestConfig = require('../../test.config');

var NavigationBarPage = function () {

    var contentServicesButton = element(by.css("a[data-automation-id='Content Services']"));
    var configEditoButton = element(by.css("a[data-automation-id='Configuration Editor']"));
    var processServicesButton = element(by.css("a[data-automation-id='Process Services']"));
    var loginButton = element(by.css("a[data-automation-id='Login']"));
    var trashcanButton = element(by.css("a[data-automation-id='Trashcan']"));
    var userProfileButton = element(by.css("button[data-automation-id='adf-user-profile']"));
    var themeButton = element(by.css("button[data-automation-id='theme menu']"));
    var themeMenuContent = element(by.css("div[class*='mat-menu-panel']"));
    var logoutButton = element(by.css("a[adf-logout]"));
    var cardViewButton = element(by.cssContainingText(".sidenav-menu-label", "CardView"));
    var languageMenuButton = element(by.css('button[data-automation-id="language-menu-button"]'));
    var appTitle = element(by.css('.adf-app-title'));
    var headerDataButton = element(by.css("a[data-automation-id='Header Data']"));
    var menuButton = element(by.css('button[data-automation-id="adf-menu-icon"]'));

    this.clickContentServicesButton = function () {
        Util.waitUntilElementIsVisible(contentServicesButton);
        contentServicesButton.click();
    };

    this.clickConfigEditorButton = function () {
        Util.waitUntilElementIsVisible(configEditoButton);
        configEditoButton.click();
    };

    this.clickProcessServicesButton = function () {
        Util.waitUntilElementIsVisible(processServicesButton);
        processServicesButton.click();
    };

    this.clickLoginButton = function () {
        Util.waitUntilElementIsVisible(loginButton);
        loginButton.click();
    };

    this.clickTrashcanButton = function () {
        Util.waitUntilElementIsVisible(trashcanButton);
        trashcanButton.click();
    };

    this.clickUserProfile = function () {
        Util.waitUntilElementIsVisible(userProfileButton);
        userProfileButton.click();
    };

    this.clickThemeButton = function () {
        Util.waitUntilElementIsVisible(themeButton);
        themeButton.click();
        Util.waitUntilElementIsVisible(themeMenuContent);
    };

    this.clickOnSpecificThemeButton = function (themeName) {
        var themeElement = element(by.css("button[data-automation-id='" + themeName + "']"));
        Util.waitUntilElementIsVisible(themeElement);
        Util.waitUntilElementIsClickable(themeElement);
        themeElement.click();
    };

    /**
     * Click Logout Button
     * @method clickLogoutButton
     */
    this.clickLogoutButton = function () {
        Util.waitUntilElementIsVisible(logoutButton);
        logoutButton.click();
    };

    /**
     * Click Card View Button
     * @method clickCardViewButton
     */
    this.clickCardViewButton = function () {
        Util.waitUntilElementIsVisible(cardViewButton);
        cardViewButton.click();
    };

    /**
     * Click Card View Button
     * @method clickCardViewButton
     */
    this.openContentServicesFolder = function (folderId) {
        return browser.get(TestConfig.adf.url + '/files/' + folderId);
    };

    this.chooseLanguage = function(language) {
        let buttonLanguage = element(by.xpath(`//adf-language-menu//button[contains(text(), '${language}')]`));
        Util.waitUntilElementIsVisible(buttonLanguage);
        buttonLanguage.click();
    };

    this.openLanguageMenu = function () {
        Util.waitUntilElementIsVisible(languageMenuButton);
        languageMenuButton.click();
        Util.waitUntilElementIsVisible(appTitle);
    };

    this.clickHeaderDataButton = function () {
        Util.waitUntilElementIsVisible(headerDataButton);
        Util.waitUntilElementIsClickable(headerDataButton);
        return headerDataButton.click();
    };

    this.checkMenuButtonIsDisplayed = function () {
        return Util.waitUntilElementIsVisible(menuButton);
    };

    this.checkMenuButtonIsNotDisplayed = function () {
        return Util.waitUntilElementIsNotVisible(menuButton);
    };

    this.checkToolbarColor = function (color) {
        var toolbarColor = element(by.css(`mat-toolbar[class*="mat-${color}"]`));
        return Util.waitUntilElementIsVisible(toolbarColor);
    };

    this.clickAppLogo = function (logoTitle) {
        var appLogo = element(by.css('a[title="'+ logoTitle +'"]'));
        Util.waitUntilElementIsVisible(appLogo);
        appLogo.click();
    };

    this.clickAppLogoText = function () {
        Util.waitUntilElementIsVisible(appTitle);
        appTitle.click();
    };

    this.openViewer = function (nodeId) {
        browser.get(TestConfig.adf.url + `/files(overlay:files/${nodeId}/view`);
        return this;
    };

    this.goToSite = function (site) {
        browser.get(TestConfig.adf.url + `/files/${site.entry.guid}/display/list`);
    };

    this.checkContentServicesButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(contentServicesButton);
    };
};

module.exports = NavigationBarPage;
