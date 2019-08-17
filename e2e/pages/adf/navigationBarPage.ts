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
    processServicesNestedButton = this.linkMenuChildrenContainer.element(by.css('.adf-sidenav-link[data-automation-id="App"]'));
    processServicesCloudHomeButton = this.linkMenuChildrenContainer.element(by.css('.adf-sidenav-link[data-automation-id="Home"]'));
    themeButton: ElementFinder = element(by.css('button[data-automation-id="theme menu"]'));
    themeMenuContent: ElementFinder = element(by.css('div[class*="mat-menu-panel"]'));
    languageMenuButton: ElementFinder = element(by.css('button[data-automation-id="language-menu-button"]'));
    appTitle: ElementFinder = element(by.css('.adf-app-title'));
    menuButton: ElementFinder = element(by.css('button[data-automation-id="adf-menu-icon"]'));
    formButton = this.linkMenuChildrenContainer.element(by.css('.adf-sidenav-link[data-automation-id="Form"]'));
    peopleGroupCloudButton = this.linkMenuChildrenContainer.element(by.css('.adf-sidenav-link[data-automation-id="People/Group Cloud"]'));

    async clickNavigationBarItem(title): Promise<void> {
        const menu = element(by.css(`.adf-sidenav-link[data-automation-id="${title}"]`));
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

    async navigateToPeopleGroupCloudPage(): Promise<PeopleGroupCloudComponentPage> {
        await this.clickProcessCloudButton();
        await BrowserActions.click(this.peopleGroupCloudButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
        return new PeopleGroupCloudComponentPage();
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
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.clickExecuteScript('.adf-sidenav-link[adf-logout]');
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

    async openContentServicesFolder(folderId): Promise<void> {
        await BrowserActions.getUrl(`${browser.params.testConfig.adf.url}/files/${folderId}`);
    }

    async openLanguageMenu(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.languageMenuButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.appTitle);
    }

    async chooseLanguage(language): Promise<void> {
        const buttonLanguage: ElementFinder = element(by.xpath(`//adf-language-menu//button[contains(text(), '${language}')]`));
        await BrowserActions.click(buttonLanguage);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
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
