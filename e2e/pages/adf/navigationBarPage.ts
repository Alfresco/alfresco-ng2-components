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
    dataTableNestedButton = element(by.css('button[data-automation-id="Datatable"]'));
    dataTableCopyContentButton = element(by.css('button[data-automation-id="Copy Content"]'));
    dataTableDragAndDropButton = element(by.css('button[data-automation-id="Drag and Drop"]'));
    processServicesButton = element(by.css('a[data-automation-id="Process Services"]'));
    processServicesNestedButton = element(by.css('button[data-automation-id="App"]'));
    processServicesCloudHomeButton = element(by.css('button[data-automation-id="Home"]'));
    loginButton = element(by.css('a[data-automation-id="Login"]'));
    overlayViewerButton = element(by.css('a[data-automation-id="Overlay Viewer"]'));
    themeButton = element(by.css('button[data-automation-id="theme menu"]'));
    themeMenuContent = element(by.css('div[class*="mat-menu-panel"]'));
    logoutButton = element(by.css('a[adf-logout]'));
    cardViewButton = element(by.cssContainingText('.adf-sidenav-menu-label', 'CardView'));
    languageMenuButton = element(by.css('button[data-automation-id="language-menu-button"]'));
    appTitle = element(by.css('.adf-app-title'));
    menuButton = element(by.css('button[data-automation-id="adf-menu-icon"]'));
    formButton = element(by.css('button[data-automation-id="Form"]'));
    peopleGroupCloudButton = element(by.css('button[data-automation-id="People/Group Cloud"]'));

    clickMenuButton(title) {
        BrowserActions.clickExecuteScript(`a[data-automation-id="${title}"]`);
    }

    async clickTagButton() {
        this.clickMenuButton('Tag');
    }

    async navigateToDatatable() {
        this.clickMenuButton('Datatable');
        BrowserActions.click(this.dataTableNestedButton);
    }

    async navigateToCopyContentDatatable() {
        this.clickMenuButton('Datatable');
        BrowserActions.click(this.dataTableCopyContentButton);
    }

    async navigateToDragAndDropDatatable() {
        this.clickMenuButton('Datatable');
        BrowserActions.click(this.dataTableDragAndDropButton);
    }

    async clickContentServicesButton() {
        this.clickMenuButton('Content Services');
    }

    async clickTaskListButton() {
        this.clickMenuButton('Task List');
    }

    async clickHomeButton() {
        this.clickMenuButton('Home');
    }

    async clickConfigEditorButton() {
        this.clickMenuButton('Configuration Editor');
    }

    navigateToProcessServicesPage() {
        this.clickMenuButton('Process Services');
        BrowserActions.click(this.processServicesNestedButton);
        return new ProcessServicesPage();
    }

    navigateToProcessServicesCloudPage() {
        this.clickMenuButton('Process Cloud');
        BrowserActions.click(this.processServicesCloudHomeButton);
        return new AppListCloudPage();
    }

    navigateToPeopleGroupCloudPage() {
        this.clickMenuButton('Process Cloud');
        BrowserActions.click(this.peopleGroupCloudButton);
        return new PeopleGroupCloudComponentPage();
    }

    async navigateToSettingsPage() {
        this.clickMenuButton('Settings');
        return new AppListCloudPage();
    }

    async clickLoginButton() {
        this.clickMenuButton('Login');
    }

    async clickTrashcanButton() {
        this.clickMenuButton('Trashcan');
    }

    async clickOverlayViewerButton() {
        this.clickMenuButton('Overlay Viewer');
        return this;
    }

    async clickThemeButton() {
        BrowserActions.closeMenuAndDialogs();
        BrowserActions.click(this.themeButton);
        BrowserVisibility.waitUntilElementIsVisible(this.themeMenuContent);
    }

    async clickOnSpecificThemeButton(themeName) {
        const themeElement = element(by.css(`button[data-automation-id="${themeName}"]`));
        BrowserActions.click(themeElement);
    }

    async clickLogoutButton() {
        BrowserActions.closeMenuAndDialogs();
        BrowserActions.click(this.logoutButton);
    }

    async clickCardViewButton() {
        BrowserActions.closeMenuAndDialogs();
        BrowserActions.click(this.cardViewButton);
    }

    openContentServicesFolder(folderId) {
        return BrowserActions.getUrl(TestConfig.adf.url + '/files/' + folderId);
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
        this.clickMenuButton('Header Data');
    }

    async clickAboutButton() {
        this.clickMenuButton('About');
    }

    async clickTreeViewButton() {
        this.clickMenuButton('Tree View');
    }

    async navigateToIconsPage() {
        this.clickMenuButton('Icons');
    }

    async navigateToCustomSources() {
        this.clickMenuButton('Custom Sources');
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
        BrowserActions.closeMenuAndDialogs();
        BrowserActions.click(this.processServicesButton);
        BrowserActions.click(this.formButton);
    }

    checkLogoTooltip(logoTooltipTitle) {
        const logoTooltip = element(by.css('a[title="' + logoTooltipTitle + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(logoTooltip);
    }

    async openViewer(nodeId) {
        await  BrowserActions.getUrl(TestConfig.adf.url + `/files(overlay:files/${nodeId}/view`);
        return this;
    }

    async goToSite(site) {
        await BrowserActions.getUrl(TestConfig.adf.url + `/files/${site.entry.guid}/display/list`);
    }

    async scrollTo(el: ElementFinder) {
        await browser.executeScript(`return arguments[0].scrollTop = arguments[1].offsetTop`, this.linkListContainer.getWebElement(), el.getWebElement());
        return this;
    }
}
