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
import { PeopleGroupCloudComponentPage } from './demo-shell/process-services/peopleGroupCloudComponentPage';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class NavigationBarPage {

    linkListContainer: ElementFinder = element(by.css('.adf-sidenav-linklist'));
    linkMenuChildrenContainer: ElementFinder = element(by.css('.nestedMenu'));
    dataTableNestedButton = this.linkMenuChildrenContainer.element(by.css('.adf-sidenav-link[data-automation-id="Datatable"]'));
    dataTableCopyContentButton = this.linkMenuChildrenContainer.element(by.css('.adf-sidenav-link[data-automation-id="Copy Content"]'));
    dataTableDragAndDropButton = this.linkMenuChildrenContainer.element(by.css('.adf-sidenav-link[data-automation-id="Drag and Drop"]'));
    processServicesButton: ElementFinder = element(by.css('.adf-sidenav-link[data-automation-id="Process Services"]'));
    processServicesNestedButton = this.linkMenuChildrenContainer.element(by.css('.adf-sidenav-link[data-automation-id="App"]'));
    processServicesCloudHomeButton = this.linkMenuChildrenContainer.element(by.css('.adf-sidenav-link[data-automation-id="Home"]'));
    loginButton: ElementFinder = element(by.css('.adf-sidenav-link[data-automation-id="Login"]'));
    overlayViewerButton: ElementFinder = element(by.css('.adf-sidenav-link[data-automation-id="Overlay Viewer"]'));
    themeButton: ElementFinder = element(by.css('button[data-automation-id="theme menu"]'));
    themeMenuContent: ElementFinder = element(by.css('div[class*="mat-menu-panel"]'));
    logoutButton: ElementFinder = element(by.css('.adf-sidenav-link[adf-logout]'));
    cardViewButton: ElementFinder = element(by.css('.adf-sidenav-link[data-automation-id="CardView"]'));
    languageMenuButton: ElementFinder = element(by.css('button[data-automation-id="language-menu-button"]'));
    appTitle: ElementFinder = element(by.css('.adf-app-title'));
    menuButton: ElementFinder = element(by.css('button[data-automation-id="adf-menu-icon"]'));
    formButton = this.linkMenuChildrenContainer.element(by.css('.adf-sidenav-link[data-automation-id="Form"]'));
    peopleGroupCloudButton = this.linkMenuChildrenContainer.element(by.css('.adf-sidenav-link[data-automation-id="People/Group Cloud"]'));

    async clickDataTable(): Promise<void> {
        await BrowserActions.click(element(by.css(`.adf-sidenav-link[data-automation-id="Datatable"]`)));
        await BrowserVisibility.waitUntilElementIsVisible(this.linkMenuChildrenContainer);
    }

    async clickMenuButton(title): Promise<void> {
        const menu = element(by.css(`.adf-sidenav-link[data-automation-id="${title}"]`));
        await BrowserActions.click(menu);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async clickSocialButton(): Promise<void> {
        await this.clickMenuButton('Social');
    }

    async clickTagButton(): Promise<void> {
        await this.clickMenuButton('Tag');
    }

    async navigateToDatatable(): Promise<void> {
        await this.clickDataTable();
        await BrowserActions.click(this.dataTableNestedButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async navigateToCopyContentDatatable(): Promise<void> {
        await this.clickDataTable();
        await BrowserActions.click(this.dataTableCopyContentButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async navigateToDragAndDropDatatable(): Promise<void> {
        await this.clickDataTable();
        await BrowserActions.click(this.dataTableDragAndDropButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async clickContentServicesButton(): Promise<void> {
        await this.clickMenuButton('Content Services');
    }

    async clickTaskListButton(): Promise<void> {
        await this.clickMenuButton('Task List');
    }

    async clickHomeButton(): Promise<void> {
        await this.clickMenuButton('Home');
    }

    async clickConfigEditorButton(): Promise<void> {
        await this.clickMenuButton('Configuration Editor');
    }

    async clickProcessCloudButton() {
        await BrowserActions.click(element(by.css(`.adf-sidenav-link[data-automation-id="Process Cloud"]`)));
        await BrowserVisibility.waitForElementToBeVisible(this.linkMenuChildrenContainer);
    }

    async clickProcessServicesButton() {
        await BrowserActions.click(element(by.css(`.adf-sidenav-link[data-automation-id="Process Services"]`)));
        await BrowserVisibility.waitForElementToBeVisible(this.linkMenuChildrenContainer);
    }

    async navigateToProcessServicesPage(): Promise<ProcessServicesPage> {
        await this.clickProcessServicesButton();
        await BrowserActions.click(this.processServicesNestedButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
        return new ProcessServicesPage();
    }

    async navigateToProcessServicesCloudPage(): Promise<AppListCloudPage> {
        await this.clickProcessCloudButton();
        await BrowserActions.click(this.processServicesCloudHomeButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
        return new AppListCloudPage();
    }

    async navigateToPeopleGroupCloudPage(): Promise<PeopleGroupCloudComponentPage> {
        await this.clickProcessCloudButton();
        await BrowserActions.click(this.peopleGroupCloudButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
        return new PeopleGroupCloudComponentPage();
    }

    async navigateToSettingsPage(): Promise<void> {
        await this.clickMenuButton('Settings');
    }

    async clickLoginButton(): Promise<void> {
        await this.clickMenuButton('Login');
    }

    async clickTrashcanButton(): Promise<void> {
        await this.clickMenuButton('Trashcan');
    }

    async clickOverlayViewerButton(): Promise<void> {
        await this.clickMenuButton('Overlay Viewer');
    }

    async clickThemeButton(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.themeButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.themeMenuContent);
    }

    async clickOnSpecificThemeButton(themeName): Promise<void> {
        const themeElement: ElementFinder = element(by.css(`button[data-automation-id="${themeName}"]`));
        await BrowserActions.click(themeElement);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async clickLogoutButton(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.logoutButton);
    }

    async clickCardViewButton(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.cardViewButton);
    }

    async openContentServicesFolder(folderId): Promise<void> {
        await BrowserActions.getUrl(`${browser.params.testConfig.adf.url}/files/${folderId}`);
    }

    async chooseLanguage(language): Promise<void> {
        const buttonLanguage: ElementFinder = element(by.xpath(`//adf-language-menu//button[contains(text(), '${language}')]`));
        await BrowserActions.click(buttonLanguage);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async openLanguageMenu(): Promise<void> {
        await BrowserActions.click(this.languageMenuButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.appTitle);
    }

    async clickHeaderDataButton(): Promise<void> {
        await this.clickMenuButton('Header Data');
    }

    async clickAboutButton(): Promise<void> {
        await this.clickMenuButton('About');
    }

    async clickTreeViewButton(): Promise<void> {
        await this.clickMenuButton('Tree View');
    }

    async navigateToIconsPage(): Promise<void> {
        await this.clickMenuButton('Icons');
    }

    async navigateToCustomSources(): Promise<void> {
        await this.clickMenuButton('Custom Sources');
    }

    async checkMenuButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.menuButton);
    }

    async checkMenuButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.menuButton);
    }

    async checkToolbarColor(color): Promise<void> {
        const toolbarColor: ElementFinder = element(by.css(`mat-toolbar[class*="mat-${color}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(toolbarColor);
    }

    async clickAppLogo(logoTitle): Promise<void> {
        const appLogo: ElementFinder = element(by.css('a[title="' + logoTitle + '"]'));
        await BrowserActions.click(appLogo);
    }

    async clickAppLogoText(): Promise<void> {
        await BrowserActions.click(this.appTitle);
    }

    async clickFormButton(): Promise<void> {
        await BrowserActions.click(this.processServicesButton);
        await BrowserActions.click(this.formButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async clickFormCloudButton(): Promise<void> {
        await this.clickMenuButton('Process Cloud');
        await BrowserActions.click(this.formButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async checkLogoTooltip(logoTooltipTitle): Promise<void> {
        const logoTooltip: ElementFinder = element(by.css('a[title="' + logoTooltipTitle + '"]'));
        await BrowserVisibility.waitUntilElementIsVisible(logoTooltip);
    }

    async openViewer(nodeId): Promise<void> {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + `/files(overlay:files/${nodeId}/view`);
    }

    async goToSite(site): Promise<void> {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + `/files/${site.entry.guid}/display/list`);
    }

    async scrollTo(el: ElementFinder): Promise<void> {
        await browser.executeScript(`return arguments[0].scrollTop = arguments[1].offsetTop`, this.linkListContainer.getWebElement(), el.getWebElement());
    }
}
