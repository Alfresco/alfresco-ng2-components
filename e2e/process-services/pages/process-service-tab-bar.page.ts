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

import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { element, by, browser } from 'protractor';

export class ProcessServiceTabBarPage {

    tasksButton = element.all(by.cssContainingText('div.mat-mdc-tab-label-container .mdc-tab__text-label', 'Tasks')).first();
    processButton = element.all(by.cssContainingText('div.mat-mdc-tab-label-container .mdc-tab__text-label', 'Process')).first();
    reportsButton = element.all(by.cssContainingText('div.mat-mdc-tab-label-container .mdc-tab__text-label', 'Reports')).first();
    reportsButtonSelected = element.all(by.cssContainingText('div.mat-mdc-tab-label-container .mdc-tab-indicator--active .mdc-tab__text-label', 'Reports')).first();

    async clickTasksButton(): Promise<void> {
        await BrowserActions.click(this.tasksButton);
        await browser.sleep(500);
    }

    async clickProcessButton(): Promise<void> {
        await BrowserActions.click(this.processButton);
        await browser.sleep(500);
    }

    async clickReportsButton(): Promise<void> {
        await BrowserActions.click(this.reportsButton);
        await BrowserVisibility.waitUntilElementIsVisible(this.reportsButtonSelected);
    }
}
