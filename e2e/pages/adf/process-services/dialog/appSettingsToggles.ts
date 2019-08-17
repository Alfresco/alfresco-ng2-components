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

import { FormControllersPage } from '@alfresco/adf-testing';
import { element, by, ElementFinder } from 'protractor';

export class AppSettingsToggles {

    formControllersPage: FormControllersPage = new FormControllersPage();

    showDetailsHeaderToggle: ElementFinder = element(by.id('adf-show-header'));
    showTaskFilterIconsToggle: ElementFinder = element(by.id('adf-show-task-filter-icon'));
    showProcessFilterIconsToggle: ElementFinder = element(by.id('adf-show-process-filter-icon'));

    async enableShowHeader(): Promise<void> {
        await this.formControllersPage.enableToggle(this.showDetailsHeaderToggle);
    }

    async disableShowHeader(): Promise<void> {
        await this.formControllersPage.disableToggle(this.showDetailsHeaderToggle);
    }

    async enableTaskFiltersIcon(): Promise<void> {
        await this.formControllersPage.enableToggle(this.showTaskFilterIconsToggle);
    }

    async enableProcessFiltersIcon(): Promise<void> {
        await this.formControllersPage.enableToggle(this.showProcessFilterIconsToggle);
    }

}
