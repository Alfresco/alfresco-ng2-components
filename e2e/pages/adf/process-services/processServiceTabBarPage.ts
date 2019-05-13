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
import { element, by, browser } from 'protractor';

export class ProcessServiceTabBarPage {

    tasksButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Tasks')).first();
    processButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Process')).first();
    reportsButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Reports')).first();
    settingsButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Settings')).first();
    reportsButtonSelected = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div[aria-selected="true"]', 'Reports')).first();

    clickTasksButton() {
        BrowserActions.click(this.tasksButton);
        browser.sleep(700);
    }

    clickProcessButton() {
        BrowserActions.click(this.processButton);
        browser.sleep(700);
    }

    clickSettingsButton() {
        BrowserActions.click(this.settingsButton);
        browser.sleep(700);
    }

    clickReportsButton() {
        BrowserActions.click(this.reportsButton);
        return BrowserVisibility.waitUntilElementIsVisible(this.reportsButtonSelected);
    }
}
