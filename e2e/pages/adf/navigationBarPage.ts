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

import { Util } from '../../util/util';
import { browser, by, element } from 'protractor';
import { ProcessServicesPage } from './process-services/processServicesPage';
import { AppListCloudComponent } from './process-cloud/appListCloudComponent';
import TestConfig = require('../../test.config');
import { PeopleGroupCloudComponentPage } from './demo-shell/process-services/peopleGroupCloudComponentPage';

export class NavigationBarPage {

    contentServicesButton = element(by.css('a[data-automation-id="Content Services"]'));
    dataTableButton = element(by.css('a[data-automation-id="Datatable"]'));
    taskListButton = element(by.css("a[data-automation-id='Task List']"));
    configEditorButton = element(by.css('a[data-automation-id="Configuration Editor"]'));
    processServicesButton = element(by.css('a[data-automation-id="Process Services"]'));
    processServicesCloudButton = element(by.css('a[data-automation-id="Process Cloud"]'));
    loginButton = element(by.css('a[data-automation-id="Login"]'));
    trashcanButton = element(by.css('a[data-automation-id="Trashcan"]'));
    overlayViewerButton = element(by.css('a[data-automation-id="Overlay Viewer"]'));
    userProfileButton = element(by.css('button[data-automation-id="adf-user-profile"]'));
    logoutButton = element(by.css('a[adf-logout]'));
    cardViewButton = element(by.cssContainingText('.adf-sidenav-menu-label', 'CardView'));
    languageMenuButton = element(by.css('button[data-automation-id="language-menu-button"]'));
    appTitle = element(by.css('.adf-app-title'));
    headerDataButton = element(by.css('a[data-automation-id="Header Data"]'));
    menuButton = element(by.css('button[data-automation-id="adf-menu-icon"]'));
    formButton = element(by.css('a[data-automation-id="Form"]'));
    treeViewButton = element(by.css('a[data-automation-id="Tree View"]'));
    iconsButton = element(by.css('a[data-automation-id="Icons"]'));
    customSourcesButton = element(by.css('a[data-automation-id="Custom Sources"]'));
    settingsButton = element(by.css('a[data-automation-id="Settings"]'));
    peopleGroupCloud = element(by.css('a[data-automation-id="People/Group Cloud"]'));
    aboutButton = element(by.css('a[data-automation-id="About"]'));

    navigateToDatatable() {
        Util.waitUntilElementIsVisible(this.dataTableButton);
        this.dataTableButton.click();
    }

    clickContentServicesButton() {
        Util.waitUntilElementIsVisible(this.contentServicesButton);
        this.contentServicesButton.click();
    }

    clickTaskListButton() {
        Util.waitUntilElementIsVisible(this.taskListButton);
        this.taskListButton.click();
    }

    clickConfigEditorButton() {
        Util.waitUntilElementIsVisible(this.configEditorButton);
        this.configEditorButton.click();
    }

    navigateToProcessServicesPage() {
        Util.waitUntilElementIsVisible(this.processServicesButton);
        this.processServicesButton.click();
        return new ProcessServicesPage();
    }

    navigateToProcessServicesCloudPage() {
        Util.waitUntilElementIsVisible(this.processServicesCloudButton);
        this.processServicesCloudButton.click();
        return new AppListCloudComponent();
    }

    navigateToPeopleGroupCloudPage() {
        Util.waitUntilElementIsVisible(this.peopleGroupCloud);
        this.peopleGroupCloud.click();
        return new PeopleGroupCloudComponentPage();
    }

    navigateToSettingsPage() {
        Util.waitUntilElementIsVisible(this.settingsButton);
        this.settingsButton.click();
        return new AppListCloudComponent();
    }

    clickLoginButton() {
        Util.waitUntilElementIsVisible(this.loginButton);
        this.loginButton.click();
    }

    clickTrashcanButton() {
        Util.waitUntilElementIsVisible(this.trashcanButton);
        this.trashcanButton.click();
    }

    clickOverlayViewerButton() {
        Util.waitUntilElementIsVisible(this.overlayViewerButton);
        this.overlayViewerButton.click();
        return this;
    }

    clickUserProfile() {
        Util.waitUntilElementIsVisible(this.userProfileButton);
        this.userProfileButton.click();
    }

    clickLogoutButton() {
        Util.waitUntilElementIsVisible(this.logoutButton);
        this.logoutButton.click();
    }

    clickCardViewButton() {
        Util.waitUntilElementIsVisible(this.cardViewButton);
        this.cardViewButton.click();
    }

    openContentServicesFolder(folderId) {
        return browser.get(TestConfig.adf.url + '/files/' + folderId);
    }

    chooseLanguage(language) {
        let buttonLanguage = element(by.xpath(`//adf-language-menu//button[contains(text(), '${language}')]`));
        Util.waitUntilElementIsVisible(buttonLanguage);
        buttonLanguage.click();
    }

    openLanguageMenu() {
        Util.waitUntilElementIsVisible(this.languageMenuButton);
        this.languageMenuButton.click();
        Util.waitUntilElementIsVisible(this.appTitle);
    }

    clickHeaderDataButton() {
        Util.waitUntilElementIsVisible(this.headerDataButton);
        Util.waitUntilElementIsClickable(this.headerDataButton);
        return this.headerDataButton.click();
    }

    clickAboutButton() {
        Util.waitUntilElementIsClickable(this.aboutButton);
        return this.aboutButton.click();
    }

    checkAboutButtonIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.aboutButton);
    }

    checkMenuButtonIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.menuButton);
    }

    checkMenuButtonIsNotDisplayed() {
        return Util.waitUntilElementIsNotVisible(this.menuButton);
    }

    checkToolbarColor(color) {
        let toolbarColor = element(by.css(`mat-toolbar[class*="mat-${color}"]`));
        return Util.waitUntilElementIsVisible(toolbarColor);
    }

    clickAppLogo(logoTitle) {
        let appLogo = element(by.css('a[title="' + logoTitle + '"]'));
        Util.waitUntilElementIsVisible(appLogo);
        appLogo.click();
    }

    clickAppLogoText() {
        Util.waitUntilElementIsVisible(this.appTitle);
        this.appTitle.click();
    }

    clickFormButton() {
        Util.waitUntilElementIsVisible(this.formButton);
        return this.formButton.click();
    }

    checkLogoTooltip(logoTooltipTitle) {
        let logoTooltip = element(by.css('a[title="' + logoTooltipTitle + '"]'));
        Util.waitUntilElementIsVisible(logoTooltip);
    }

    goToSite(site) {
        browser.get(TestConfig.adf.url + `/files/${site.entry.guid}/display/list`);
    }

    clickTreeViewButton() {
        Util.waitUntilElementIsVisible(this.treeViewButton);
        this.treeViewButton.click();
    }

    navigateToIconsPage() {
        Util.waitUntilElementIsVisible(this.iconsButton);
        this.iconsButton.click();
    }

    navigateToCustomSources() {
        Util.waitUntilElementIsVisible(this.customSourcesButton);
        this.customSourcesButton.click();
    }
}
