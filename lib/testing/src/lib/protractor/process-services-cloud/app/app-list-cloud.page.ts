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

import { $$, $, ElementFinder } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class AppListCloudPage {

    apsAppsContainer = $('adf-cloud-app-list');
    allApps = $$('adf-cloud-app-details');
    nameOfAllApps = $$('adf-cloud-app-details div[class*="item-card-title"] h1');
    firstApp = $$('adf-cloud-app-details div[class*="item-card-title"] h1').first();

    getAppNameLocatorByAppName = (appName: string): ElementFinder => $(`mat-card[title="${appName}"]`);

    async checkApsContainer(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.apsAppsContainer);
        await BrowserVisibility.waitUntilElementIsVisible(this.firstApp);
    }

    async goToApp(applicationName: string): Promise<void> {
        await BrowserActions.clickExecuteScript('mat-card[title="' + applicationName + '"]');
    }

    async countAllApps(): Promise<number> {
        return this.allApps.count();
    }

    async getNameOfTheApplications(): Promise<string> {
        return BrowserActions.getArrayText(this.nameOfAllApps);
    }

    async checkAppIsNotDisplayed(applicationName: string): Promise<void> {
        const app = this.getAppNameLocatorByAppName(applicationName);
        await BrowserVisibility.waitUntilElementIsNotVisible(app);
    }

    async checkAppIsDisplayed(applicationName: string): Promise<void> {
        const app = this.getAppNameLocatorByAppName(applicationName);
        await BrowserVisibility.waitUntilElementIsVisible(app);
    }

}
