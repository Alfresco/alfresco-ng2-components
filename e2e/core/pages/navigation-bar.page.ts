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

import { AppListCloudPage, BrowserActions, BrowserVisibility, Logger } from '@alfresco/adf-testing';
import { browser, by, element, ElementFinder } from 'protractor';
import { ProcessServicesPage } from '../../process-services/pages/process-services.page';

export class NavigationBarPage {

    linkListContainer = element(by.css('.app-sidenav-linklist'));
    linkMenuChildrenContainer = element(by.css('.nestedMenu'));
    dataTableNestedButton = this.linkMenuChildrenContainer.element(by.css('.app-sidenav-link[data-automation-id="Datatable"]'));
    dataTableCopyContentButton = this.linkMenuChildrenContainer.element(by.css('.app-sidenav-link[data-automation-id="Copy Content"]'));
    dataTableDragAndDropButton = this.linkMenuChildrenContainer.element(by.css('.app-sidenav-link[data-automation-id="Drag and Drop"]'));
    processServicesNestedButton = this.linkMenuChildrenContainer.element(by.css('.app-sidenav-link[data-automation-id="App"]'));
    processServicesCloudHomeButton = this.linkMenuChildrenContainer.element(by.css('.app-sidenav-link[data-automation-id="Home"]'));
    themeButton = element(by.css('button[data-automation-id="theme menu"]'));
    themeMenuContent = element(by.css('div[class*="mat-menu-panel"]'));
    languageMenuButton = element(by.css('button[data-automation-id="language-menu-button"]'));
    appTitle = element(by.css('.adf-app-title'));
    menuButton = element(by.css('button[data-automation-id="adf-menu-icon"]'));
    formButton = this.linkMenuChildrenContainer.element(by.css('.app-sidenav-link[data-automation-id="Form"]'));
    peopleGroupCloudButton = this.linkMenuChildrenContainer.element(by.css('.app-sidenav-link[data-automation-id="People/Group Cloud"]'));

    async clickNavigationBarItem(title: string): Promise<void> {
        const menu = element(by.css(`.app-sidenav-link[data-automation-id="${title}"]`));
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(menu);
    }

    async clickHomeButton(): Promise<void> {
        await this.clickNavigationBarItem('Home');
    }

    async clickContentServicesButton(): Promise<void> {
        await this.clickNavigationBarItem('Content Services');
    }

    async clickCardViewButton(): Promise<void> {
        await this.clickNavigationBarItem('CardView');
    }

    async clickHeaderDataButton(): Promise<void> {
        await this.clickNavigationBarItem('Header Data');
    }

    async clickTaskListButton(): Promise<void> {
        await this.clickNavigationBarItem('Task List');
    }

    async clickProcessCloudButton() {
        await this.clickNavigationBarItem('Process Cloud');
        await BrowserVisibility.waitUntilElementIsVisible(this.linkMenuChildrenContainer);
    }

    async navigateToProcessServicesCloudPage(): Promise<AppListCloudPage> {
        await this.clickProcessCloudButton();
        await BrowserActions.click(this.processServicesCloudHomeButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
        return new AppListCloudPage();
    }

    async navigateToFormCloudPage(): Promise<void> {
        await this.clickProcessCloudButton();
        await BrowserActions.click(this.formButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async navigateToPeopleGroupCloudPage(): Promise<void> {
        await this.clickProcessCloudButton();
        await BrowserActions.click(this.peopleGroupCloudButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async clickProcessServicesButton() {
        await this.clickNavigationBarItem('Process Services');
        await BrowserVisibility.waitUntilElementIsVisible(this.linkMenuChildrenContainer);
    }

    async navigateToProcessServicesPage(): Promise<ProcessServicesPage> {
        await this.clickProcessServicesButton();
        await BrowserActions.click(this.processServicesNestedButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
        return new ProcessServicesPage();
    }

    async navigateToProcessServicesFormPage(): Promise<void> {
        await this.clickProcessServicesButton();
        await BrowserActions.click(this.formButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async clickLoginButton(): Promise<void> {
        await this.clickNavigationBarItem('Login');
    }

    async clickTrashcanButton(): Promise<void> {
        await this.clickNavigationBarItem('Trashcan');
    }

    async clickCustomSources(): Promise<void> {
        await this.clickNavigationBarItem('Custom Sources');
    }

    async clickDataTable(): Promise<void> {
        await this.clickNavigationBarItem('Datatable');
        await BrowserVisibility.waitUntilElementIsVisible(this.linkMenuChildrenContainer);
    }

    async navigateToDatatable(): Promise<void> {
        await this.clickDataTable();
        await BrowserActions.click(this.dataTableNestedButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async navigateToDragAndDropDatatable(): Promise<void> {
        await this.clickDataTable();
        await BrowserActions.click(this.dataTableDragAndDropButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async navigateToCopyContentDatatable(): Promise<void> {
        await this.clickDataTable();
        await BrowserActions.click(this.dataTableCopyContentButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async clickTagButton(): Promise<void> {
        await this.clickNavigationBarItem('Tag');
    }

    async clickSocialButton(): Promise<void> {
        await this.clickNavigationBarItem('Social');
    }

    async clickSettingsButton(): Promise<void> {
        await this.clickNavigationBarItem('Settings');
    }

    async clickConfigEditorButton(): Promise<void> {
        await this.clickNavigationBarItem('Configuration Editor');
    }

    async clickOverlayViewerButton(): Promise<void> {
        await this.clickNavigationBarItem('Overlay Viewer');
    }

    async clickTreeViewButton(): Promise<void> {
        await this.clickNavigationBarItem('Tree View');
    }

    async clickIconsButton(): Promise<void> {
        await this.clickNavigationBarItem('Icons');
    }

    async clickAboutButton(): Promise<void> {
        await this.clickNavigationBarItem('About');
    }

    async clickLogoutButton(): Promise<void> {
        Logger.log('Logout');
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.clickExecuteScript('.app-sidenav-link[adf-logout]');
    }

    async clickThemeButton(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.themeButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.themeMenuContent);
    }

    async clickOnSpecificThemeButton(themeName): Promise<void> {
        const themeElement = element(by.css(`button[data-automation-id="${themeName}"]`));
        await BrowserActions.click(themeElement);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async openContentServicesFolder(folderId): Promise<void> {
        await BrowserActions.getUrl(`${browser.baseUrl}/files/${folderId}`);
    }

    async openLanguageMenu(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.languageMenuButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.appTitle);
    }

    async chooseLanguage(language): Promise<void> {
        const buttonLanguage = element(by.xpath(`//adf-language-menu//button[contains(text(), '${language}')]`));
        await BrowserActions.click(buttonLanguage);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async checkMenuButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.menuButton);
    }

    async checkMenuButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.menuButton);
    }

    async checkToolbarColor(color: string): Promise<void> {
        const toolbarColor = element(by.css(`mat-toolbar[class*="mat-${color}"]`));
        await BrowserVisibility.waitUntilElementIsVisible(toolbarColor);
    }

    async clickAppLogo(logoTitle: string): Promise<void> {
        const appLogo = element(by.css('a[title="' + logoTitle + '"]'));
        await BrowserActions.click(appLogo);
    }

    async clickAppLogoText(): Promise<void> {
        await BrowserActions.click(this.appTitle);
    }

    async checkLogoTooltip(logoTooltipTitle: string): Promise<void> {
        const logoTooltip = element(by.css('a[title="' + logoTooltipTitle + '"]'));
        await BrowserVisibility.waitUntilElementIsVisible(logoTooltip);
    }

    async openViewer(nodeId: string): Promise<void> {
        await BrowserActions.getUrl(browser.baseUrl + `/files(overlay:files/${nodeId}/view`);
    }

    async goToSite(site): Promise<void> {
        await BrowserActions.getUrl(browser.baseUrl + `/files/${site.entry.guid}/display/list`);
    }

    async scrollTo(el: ElementFinder): Promise<void> {
        await browser.executeScript(`return arguments[0].scrollTop = arguments[1].offsetTop`, this.linkListContainer.getWebElement(), el.getWebElement());
    }
}
