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

import { ProcessServiceTabBarPage } from './process-service-tab-bar.page';

import { browser, $, ElementFinder } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { TasksPage } from './tasks.page';

export class ProcessServicesPage {

    apsAppsContainer = $('.adf-app-listgrid');
    iconTypeLocator = 'mat-icon[class*="card-logo-icon"]';
    descriptionLocator = 'mat-card-subtitle[class*="subtitle"]';

    getApplicationNameLocator = (name: string): ElementFinder => $(`mat-card[title="${name}"]`);

    async checkApsContainer(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.apsAppsContainer);
    }

    async goToApp(applicationName: string): Promise<ProcessServiceTabBarPage> {
        const app = this.getApplicationNameLocator(applicationName);
        await BrowserActions.click(app);
        const taskPage = new TasksPage();
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        return new ProcessServiceTabBarPage();
    }

    async goToTaskApp(): Promise<ProcessServiceTabBarPage> {
        const taskAppLocator = this.getApplicationNameLocator('Task App');
        await BrowserActions.click(taskAppLocator);
        return new ProcessServiceTabBarPage();
    }

    async goToAppByAppId(appId: string): Promise<void> {
        const urlToNavigateTo = `${browser.baseUrl}/activiti/apps/${appId}/tasks/`;
        await BrowserActions.getUrl(urlToNavigateTo);
        const taskPage = new TasksPage();
        await taskPage.tasksListPage().checkTaskListIsLoaded();
    }

    async getAppIconType(applicationName: string): Promise<string> {
        const app = this.getApplicationNameLocator(applicationName);
        await BrowserVisibility.waitUntilElementIsVisible(app);
        const iconType = await app.$(this.iconTypeLocator);
        return BrowserActions.getText(iconType);
    }

    async getBackgroundColor(applicationName: string): Promise<string> {
        const app = this.getApplicationNameLocator(applicationName);
        await BrowserVisibility.waitUntilElementIsVisible(app);
        return app.getCssValue('background-color');
    }

    async getDescription(applicationName: string): Promise<string> {
        const app = this.getApplicationNameLocator(applicationName);
        await BrowserVisibility.waitUntilElementIsVisible(app);
        const description = await app.$(this.descriptionLocator);
        return BrowserActions.getText(description);
    }

    async checkAppIsNotDisplayed(applicationName: string): Promise<void> {
        const app = this.getApplicationNameLocator(applicationName);
        await BrowserVisibility.waitUntilElementIsNotVisible(app);
    }

    async checkAppIsDisplayed(applicationName: string): Promise<void> {
        const app = this.getApplicationNameLocator(applicationName);
        await BrowserVisibility.waitUntilElementIsVisible(app);
    }
}
