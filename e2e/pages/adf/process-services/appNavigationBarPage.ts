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

import { Util } from '../../../util/util';
import { element, by, browser } from 'protractor';

export class AppNavigationBarPage {

    tasksButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Tasks')).first();
    tagButton = element.all(by.css('[data-automation-id="Tag"]'));
    processButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Process')).first();
    reportsButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Reports')).first();
    settingsButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Settings')).first();
    reportsButtonSelected = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div[aria-selected="true"]', 'Reports')).first();

    clickTasksButton() {
        Util.waitUntilElementIsVisible(this.tasksButton);
        this.tasksButton.click();
        return browser.sleep(400);
    }

    clickProcessButton() {
        this.processButton.click();
        return browser.sleep(400);
    }

    clickTagButton() {
        return this.tagButton.click();
    }

    clickSettingsButton() {
        this.settingsButton.click();
        return browser.sleep(400);
    }

    clickReportsButton() {
        Util.waitUntilElementIsVisible(this.reportsButton);
        this.reportsButton.click();
        return Util.waitUntilElementIsVisible(this.reportsButtonSelected);
    }
}
