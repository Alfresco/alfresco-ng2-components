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

import { AppListCloudPage, BrowserActions, BrowserVisibility, Logger } from '@alfresco/adf-testing';
import { $, browser, ElementFinder } from 'protractor';
import { ProcessServicesPage } from '../../process-services/pages/process-services.page';

export class NavigationBarPage {

    linkListContainer = $('.app-sidenav-linklist');
    linkMenuChildrenContainer = $('.nestedMenu');
    dataTableNestedButton = this.linkMenuChildrenContainer.$('.app-sidenav-link[data-automation-id="Datatable"]');
    dataTableCopyContentButton = this.linkMenuChildrenContainer.$('.app-sidenav-link[data-automation-id="Copy Content"]');
    dataTableDragAndDropButton = this.linkMenuChildrenContainer.$('.app-sidenav-link[data-automation-id="Drag and Drop"]');
    processServicesNestedButton = this.linkMenuChildrenContainer.$('.app-sidenav-link[data-automation-id="App"]');
    processServicesCloudHomeButton = this.linkMenuChildrenContainer.$('.app-sidenav-link[data-automation-id="Home"]');
    themeButton = $('button[data-automation-id="theme menu"]');
    themeMenuContent = $('div[class*="mat-menu-panel"]');
    appTitle = $('.adf-app-title');
    menuButton = $('button[data-automation-id="adf-menu-icon"]');
    formButton = this.linkMenuChildrenContainer.$('.app-sidenav-link[data-automation-id="Form"]');
    peopleGroupCloudButton = this.linkMenuChildrenContainer.$('.app-sidenav-link[data-automation-id="People/Group Cloud"]');
    serviceTaskListButton = this.linkMenuChildrenContainer.$('.app-sidenav-link[data-automation-id="Service Task List"]');
    logoutSection = $('div[data-automation-id="adf-logout-section"]');
    personalFiles = $('div [title="Personal Files"]');

    getMenuItemLocator = (title: string) => $(`.app-sidenav-link[data-automation-id="${title}"]`);

    async clickNavigationBarItem(title: string, untilElementIsVisible?: ElementFinder): Promise<void> {
        Logger.log(`clickNavigationBarItem ${title}`);

        const menu = $(`.app-sidenav-link[data-automation-id="${title}"]`);
        await BrowserActions.closeMenuAndDialogs();

        if (untilElementIsVisible) {
            await BrowserActions.clickUntilIsNotVisible(menu, untilElementIsVisible);
        } else {
            await BrowserActions.click(menu);
        }
    }

    async clickHomeButton(): Promise<void> {
        await this.clickNavigationBarItem('Home');
    }

    async navigateToContentServices(): Promise<void> {
        await this.clickNavigationBarItem('Content Services', this.personalFiles);
    }

    async clickHeaderDataButton(): Promise<void> {
        await this.clickNavigationBarItem('Header Data');
    }

    async clickTaskListButton(): Promise<void> {
        await this.clickNavigationBarItem('Task List');
    }

    async clickProcessCloudButton() {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.clickUntilIsNotVisible(this.getMenuItemLocator('Process Cloud'), this.linkMenuChildrenContainer);
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

    async navigateToServiceTaskListCloudPage(): Promise<void> {
        await this.clickProcessCloudButton();
        await BrowserActions.click(this.serviceTaskListButton);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    private async clickProcessServicesButton() {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.clickUntilIsNotVisible(this.getMenuItemLocator('Process Services'), this.linkMenuChildrenContainer);
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
        try {
            await BrowserActions.closeMenuAndDialogs();
            await BrowserActions.clickExecuteScript('.app-sidenav-link[adf-logout]');

            await BrowserVisibility.waitUntilElementIsPresent(this.logoutSection);
        } catch (error) {
            Logger.log('Logout section NOT found');
        }
    }

    async clickThemeButton(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.themeButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.themeMenuContent);
    }

    async clickOnSpecificThemeButton(themeName): Promise<void> {
        const themeElement = $(`button[data-automation-id="${themeName}"]`);
        await BrowserActions.click(themeElement);
        await BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer);
    }

    async openContentServicesFolder(folderId): Promise<void> {
        await BrowserActions.getUrl(`${browser.baseUrl}/files/${folderId}`);
    }

    async checkMenuButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.menuButton);
    }

    async checkMenuButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.menuButton);
    }

    async checkToolbarColor(color: string): Promise<void> {
        const toolbarColor = $(`mat-toolbar[class*="mat-${color}"]`);
        await BrowserVisibility.waitUntilElementIsVisible(toolbarColor);
    }

    async clickAppLogo(logoTitle: string): Promise<void> {
        const appLogo = $('a[title="' + logoTitle + '"]');
        await BrowserActions.click(appLogo);
    }

    async clickAppLogoText(): Promise<void> {
        await BrowserActions.click(this.appTitle);
    }

    async checkLogoTooltip(logoTooltipTitle: string): Promise<void> {
        const logoTooltip = $('a[title="' + logoTooltipTitle + '"]');
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
