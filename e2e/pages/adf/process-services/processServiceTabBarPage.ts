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

import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { element, by, browser, ElementFinder } from 'protractor';

export class ProcessServiceTabBarPage {

    tasksButton: ElementFinder = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Tasks')).first();
    processButton: ElementFinder = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Process')).first();
    reportsButton: ElementFinder = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Reports')).first();
    settingsButton: ElementFinder = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Settings')).first();
    reportsButtonSelected: ElementFinder = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div[aria-selected="true"]', 'Reports')).first();

    async clickTasksButton(): Promise<void> {
        await BrowserActions.click(this.tasksButton);
        await browser.sleep(300);
    }

    async clickProcessButton(): Promise<void> {
        await BrowserActions.click(this.processButton);
        await browser.sleep(300);
    }

    async clickSettingsButton(): Promise<void> {
        await BrowserActions.click(this.settingsButton);
        await browser.sleep(300);
    }

    async clickReportsButton(): Promise<void> {
        await BrowserActions.click(this.reportsButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.reportsButtonSelected);
    }
}
