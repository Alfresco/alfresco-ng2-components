/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { $ } from 'protractor';
import { ProcessServicesPage } from '../../process-services/pages/process-services.page';

export class NavigationBarPage {
    linkMenuChildrenContainer = $('.nestedMenu');
    processServicesNestedButton = this.linkMenuChildrenContainer.$('.app-sidenav-link[data-automation-id="App"]');
    processServicesCloudHomeButton = this.linkMenuChildrenContainer.$('.app-sidenav-link[data-automation-id="Home"]');
    formButton = this.linkMenuChildrenContainer.$('.app-sidenav-link[data-automation-id="Form"]');
    logoutSection = $('[data-automation-id="adf-logout-section"]');

    getMenuItemLocator = (title: string) => $(`.app-sidenav-link[data-automation-id="${title}"]`);

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
}
