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
    linkMenuChildrenContainer = $('.nestedMenu');
    processServicesNestedButton = this.linkMenuChildrenContainer.$('.app-sidenav-link[data-automation-id="App"]');
    processServicesCloudHomeButton = this.linkMenuChildrenContainer.$('.app-sidenav-link[data-automation-id="Home"]');
    formButton = this.linkMenuChildrenContainer.$('.app-sidenav-link[data-automation-id="Form"]');
    logoutSection = $('[data-automation-id="adf-logout-section"]');
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

    async openContentServicesFolder(folderId): Promise<void> {
        await BrowserActions.getUrl(`${browser.baseUrl}/files/${folderId}`);
    }

    async goToSite(site): Promise<void> {
        await BrowserActions.getUrl(browser.baseUrl + `/files/${site.entry.guid}/display/list`);
    }
}
