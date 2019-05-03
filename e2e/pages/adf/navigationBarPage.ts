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

import { browser, by, element, ElementFinder } from 'protractor';
import { ProcessServicesPage } from './process-services/processServicesPage';
import { AppListCloudPage } from '@alfresco/adf-testing';
import TestConfig = require('../../test.config');
import { PeopleGroupCloudComponentPage } from './demo-shell/process-services/peopleGroupCloudComponentPage';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class NavigationBarPage {

    linkListContainer = element(by.css('.adf-sidenav-linklist'));
    contentServicesButton = element(by.css('a[data-automation-id="Content Services"]'));
    dataTableButton = element(by.css('a[data-automation-id="Datatable"]'));
    dataTableNestedButton = element(by.css('button[data-automation-id="Datatable"]'));
    dataTableCopyContentButton = element(by.css('button[data-automation-id="Copy Content"]'));
    dataTableDragAndDropButton = element(by.css('button[data-automation-id="Drag and Drop"]'));
    taskListButton = element(by.css("a[data-automation-id='Task List']"));
    configEditorButton = element(by.css('a[data-automation-id="Configuration Editor"]'));
    processServicesButton = element(by.css('a[data-automation-id="Process Services"]'));
    processServicesNestedButton = element(by.css('button[data-automation-id="App"]'));
    processServicesCloudButton = element(by.css('a[data-automation-id="Process Cloud"]'));
    processServicesCloudHomeButton = element(by.css('button[data-automation-id="Home"]'));
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
    peopleGroupCloudButton = element(by.css('button[data-automation-id="People/Group Cloud"]'));
    aboutButton = element(by.css('a[data-automation-id="About"]'));
    tagButton = element.all(by.css('a[data-automation-id="Tag"]'));

    async clickTagButton() {
        BrowserActions.click(this.tagButton);
    }

    async navigateToDatatable() {
        BrowserActions.click(this.dataTableButton);
        BrowserActions.click(this.dataTableNestedButton);
    }

    async navigateToCopyContentDatatable() {
        BrowserActions.click(this.dataTableButton);
        BrowserActions.click(this.dataTableCopyContentButton);
    }

    async navigateToDragAndDropDatatable() {
        BrowserActions.click(this.dataTableButton);
        BrowserActions.click(this.dataTableDragAndDropButton);
    }

    async clickContentServicesButton() {
        BrowserActions.click(this.contentServicesButton);
    }

    async clickTaskListButton() {
        BrowserActions.click(this.taskListButton);
    }

    async clickConfigEditorButton() {
        BrowserActions.click(this.configEditorButton);
    }

    async navigateToProcessServicesPage() {
        BrowserActions.click(this.processServicesButton);
        BrowserActions.click(this.processServicesNestedButton);
        return new ProcessServicesPage();
    }

    async navigateToProcessServicesCloudPage() {
        BrowserActions.click(this.processServicesCloudButton);
        BrowserActions.click(this.processServicesCloudHomeButton);
        return new AppListCloudPage();
    }

    async navigateToPeopleGroupCloudPage() {
        BrowserActions.click(this.processServicesCloudButton);
        BrowserActions.click(this.peopleGroupCloudButton);
        return new PeopleGroupCloudComponentPage();
    }

    async navigateToSettingsPage() {
        BrowserActions.click(this.settingsButton);
        return new AppListCloudPage();
    }

    async clickLoginButton() {
        BrowserActions.click(this.loginButton);
    }

    async clickTrashcanButton() {
        BrowserActions.click(this.trashcanButton);
    }

    async clickOverlayViewerButton() {
        BrowserActions.click(this.overlayViewerButton);
        return this;
    }

    async clickThemeButton() {
        BrowserActions.click(this.themeButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.themeMenuContent);
    }

    async clickOnSpecificThemeButton(themeName) {
        const themeElement = element(by.css(`button[data-automation-id="${themeName}"]`));
        BrowserActions.click(themeElement);
    }

    async clickLogoutButton() {
        BrowserActions.click(this.logoutButton);
    }

    async clickCardViewButton() {
        BrowserActions.click(this.cardViewButton);
    }

    async openContentServicesFolder(folderId) {
        await browser.get(TestConfig.adf.url + '/files/' + folderId);
    }

    chooseLanguage(language) {
        const buttonLanguage = element(by.xpath(`//adf-language-menu//button[contains(text(), '${language}')]`));
        BrowserActions.click(buttonLanguage);
    }

    openLanguageMenu() {
        BrowserActions.click(this.languageMenuButton);
        BrowserVisibility.waitUntilElementIsVisible(this.appTitle);
    }

    async clickHeaderDataButton() {
        BrowserActions.click(this.headerDataButton);
    }

    async clickAboutButton() {
        BrowserActions.click(this.aboutButton);
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
        BrowserActions.click(appLogo);
    }

    clickAppLogoText() {
        BrowserActions.click(this.appTitle);
    }

    clickFormButton() {
        BrowserActions.click(this.processServicesButton);
        BrowserActions.click(this.formButton);
    }

    checkLogoTooltip(logoTooltipTitle) {
        const logoTooltip = element(by.css('a[title="' + logoTooltipTitle + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(logoTooltip);
    }

    async openViewer(nodeId) {
        await  browser.get(TestConfig.adf.url + `/files(overlay:files/${nodeId}/view`);
        return this;
    }

    async goToSite(site) {
        await browser.get(TestConfig.adf.url + `/files/${site.entry.guid}/display/list`);
    }

    async clickTreeViewButton() {
        BrowserActions.click(this.treeViewButton);
    }

    async navigateToIconsPage() {
        BrowserActions.click(this.iconsButton);
    }

    async navigateToCustomSources() {
        BrowserActions.click(this.customSourcesButton);
    }

    async scrollTo(el: ElementFinder) {
        await browser.executeScript(`return arguments[0].scrollTop = arguments[1].offsetTop`, this.linkListContainer.getWebElement(), el.getWebElement());
        return this;
    }
}
