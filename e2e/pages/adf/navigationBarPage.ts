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

import { browser, by, element } from 'protractor';
import { ProcessServicesPage } from './process-services/processServicesPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import TestConfig = require('../../test.config');
import { PeopleGroupCloudComponentPage } from './demo-shell/process-services/peopleGroupCloudComponentPage';
import { BrowserVisibility } from '@alfresco/adf-testing';

export class NavigationBarPage {

    contentServicesButton = element(by.css('a[data-automation-id="Content Services"]'));
    dataTableButton = element(by.css('a[data-automation-id="Datatable"]'));
    dataTableNestedButton = element(by.css('button[data-automation-id="Datatable"]'));
    taskListButton = element(by.css("a[data-automation-id='Task List']"));
    configEditorButton = element(by.css('a[data-automation-id="Configuration Editor"]'));
    processServicesButton = element(by.css('a[data-automation-id="Process Services"]'));
    processServicesNestedButton = element(by.css('button[data-automation-id="App"]'));
    processServicesCloudButton = element(by.css('a[data-automation-id="Process Cloud"]'));
    processServicesCloudHomeButton = element(by.css('button[data-automation-id="Home"]'));
    processServicesCloudPeopleGroupButton = element(by.css('button[data-automation-id="People/Group Cloud"]'));
    loginButton = element(by.css('a[data-automation-id="Login"]'));
    trashcanButton = element(by.css('a[data-automation-id="Trashcan"]'));
    overlayViewerButton = element(by.css('a[data-automation-id="Overlay Viewer"]'));
    themeButton = element(by.css('button[data-automation-id="theme menu"]'));
    themeMenuContent = element(by.css('div[class*="mat-menu-panel"]'));
    logoutButton = element(by.css('a[adf-logout]'));
    cardViewButton = element(by.cssContainingText('.adf-sidenav-menu-label', 'CardView'));
    languageMenuButton = element(by.css('button[data-automation-id="language-menu-button"]'));
    appTitle = element(by.css('.adf-app-title'));
    headerDataButton = element(by.css('a[data-automation-id="Header Data"]'));
    menuButton = element(by.css('button[data-automation-id="adf-menu-icon"]'));
    formButton = element(by.css('button[data-automation-id="Form"]'));
    treeViewButton = element(by.css('a[data-automation-id="Tree View"]'));
    iconsButton = element(by.css('a[data-automation-id="Icons"]'));
    customSourcesButton = element(by.css('a[data-automation-id="Custom Sources"]'));
    settingsButton = element(by.css('a[data-automation-id="Settings"]'));
    peopleGroupCloud = element(by.css('a[data-automation-id="People/Group Cloud"]'));
    aboutButton = element(by.css('a[data-automation-id="About"]'));

    navigateToDatatable() {
        BrowserVisibility.waitUntilElementIsVisible(this.dataTableButton);
        this.dataTableButton.click();
        BrowserVisibility.waitUntilElementIsVisible(this.dataTableNestedButton);
        this.dataTableNestedButton.click();
    }

    clickContentServicesButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.contentServicesButton);
        this.contentServicesButton.click();
    }

    clickTaskListButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskListButton);
        this.taskListButton.click();
    }

    clickConfigEditorButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.configEditorButton);
        this.configEditorButton.click();
    }

    navigateToProcessServicesPage() {
        BrowserVisibility.waitUntilElementIsVisible(this.processServicesButton);
        this.processServicesButton.click();
        BrowserVisibility.waitUntilElementIsVisible(this.processServicesNestedButton);
        this.processServicesNestedButton.click();
        return new ProcessServicesPage();
    }

    navigateToProcessServicesCloudPage() {
        BrowserVisibility.waitUntilElementIsVisible(this.processServicesCloudButton);
        this.processServicesCloudButton.click();
        BrowserVisibility.waitUntilElementIsVisible(this.processServicesCloudHomeButton);
        this.processServicesCloudHomeButton.click();
        return new AppListCloudPage();
    }

    navigateToPeopleGroupCloudPage() {
        BrowserVisibility.waitUntilElementIsVisible(this.peopleGroupCloud);
        this.peopleGroupCloud.click();
        return new PeopleGroupCloudComponentPage();
    }

    navigateToSettingsPage() {
        BrowserVisibility.waitUntilElementIsVisible(this.settingsButton);
        this.settingsButton.click();
        return new AppListCloudPage();
    }

    clickLoginButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.loginButton);
        this.loginButton.click();
    }

    clickTrashcanButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.trashcanButton);
        this.trashcanButton.click();
    }

    clickOverlayViewerButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.overlayViewerButton);
        this.overlayViewerButton.click();
        return this;
    }

    clickThemeButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.themeButton);
        this.themeButton.click();
        BrowserVisibility.waitUntilElementIsVisible(this.themeMenuContent);
    }

    clickOnSpecificThemeButton(themeName) {
        const themeElement = element(by.css(`button[data-automation-id="${themeName}"]`));
        BrowserVisibility.waitUntilElementIsVisible(themeElement);
        BrowserVisibility.waitUntilElementIsClickable(themeElement);
        themeElement.click();
    }

    clickLogoutButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.logoutButton);
        this.logoutButton.click();
    }

    clickCardViewButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.cardViewButton);
        this.cardViewButton.click();
    }

    openContentServicesFolder(folderId) {
        return browser.get(TestConfig.adf.url + '/files/' + folderId);
    }

    chooseLanguage(language) {
        const buttonLanguage = element(by.xpath(`//adf-language-menu//button[contains(text(), '${language}')]`));
        BrowserVisibility.waitUntilElementIsVisible(buttonLanguage);
        buttonLanguage.click();
    }

    openLanguageMenu() {
        BrowserVisibility.waitUntilElementIsVisible(this.languageMenuButton);
        this.languageMenuButton.click();
        BrowserVisibility.waitUntilElementIsVisible(this.appTitle);
    }

    clickHeaderDataButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.headerDataButton);
        BrowserVisibility.waitUntilElementIsClickable(this.headerDataButton);
        return this.headerDataButton.click();
    }

    clickAboutButton() {
        BrowserVisibility.waitUntilElementIsClickable(this.aboutButton);
        return this.aboutButton.click();
    }

    checkAboutButtonIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.aboutButton);
    }

    checkMenuButtonIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.menuButton);
    }

    checkMenuButtonIsNotDisplayed() {
        return BrowserVisibility.waitUntilElementIsNotVisible(this.menuButton);
    }

    checkToolbarColor(color) {
        const toolbarColor = element(by.css(`mat-toolbar[class*="mat-${color}"]`));
        return BrowserVisibility.waitUntilElementIsVisible(toolbarColor);
    }

    clickAppLogo(logoTitle) {
        const appLogo = element(by.css('a[title="' + logoTitle + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(appLogo);
        appLogo.click();
    }

    clickAppLogoText() {
        BrowserVisibility.waitUntilElementIsVisible(this.appTitle);
        this.appTitle.click();
    }

    clickFormButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.processServicesButton);
        this.processServicesButton.click();
        BrowserVisibility.waitUntilElementIsVisible(this.formButton);
        return this.formButton.click();
    }

    checkLogoTooltip(logoTooltipTitle) {
        const logoTooltip = element(by.css('a[title="' + logoTooltipTitle + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(logoTooltip);
    }

    openViewer(nodeId) {
        browser.get(TestConfig.adf.url + `/files(overlay:files/${nodeId}/view`);
        return this;
    }

    goToSite(site) {
        browser.get(TestConfig.adf.url + `/files/${site.entry.guid}/display/list`);
    }

    clickTreeViewButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.treeViewButton);
        this.treeViewButton.click();
    }

    navigateToIconsPage() {
        BrowserVisibility.waitUntilElementIsVisible(this.iconsButton);
        this.iconsButton.click();
    }

    navigateToCustomSources() {
        BrowserVisibility.waitUntilElementIsVisible(this.customSourcesButton);
        this.customSourcesButton.click();
    }
}
