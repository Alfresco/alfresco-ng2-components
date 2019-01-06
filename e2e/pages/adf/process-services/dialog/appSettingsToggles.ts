/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { FormControllersPage } from '../../material/formControllersPage';
import { element, by } from 'protractor';

export class AppSettingsToggles {

    formControllersPage = new FormControllersPage();

    showDetailsHeaderToggle = element(by.id('adf-show-header'));
    showTaskFilterIconsToggle = element(by.id('adf-show-task-filter-icon'));
    showProcessFilterIconsToggle = element(by.id('adf-show-process-filter-icon'));

    enableShowHeader() {
        this.formControllersPage.enableToggle(this.showDetailsHeaderToggle);
        return this;
    }

    disableShowHeader() {
        this.formControllersPage.disableToggle(this.showDetailsHeaderToggle);
        return this;
    }

    enableTaskFiltersIcon() {
        this.formControllersPage.enableToggle(this.showTaskFilterIconsToggle);
        return this;
    }

    disableTaskFiltersIcon() {
        this.formControllersPage.disableToggle(this.showTaskFilterIconsToggle);
        return this;
    }

    enableProcessFiltersIcon() {
        this.formControllersPage.enableToggle(this.showProcessFilterIconsToggle);
        return this;
    }

    disableProcessFiltersIcon() {
        this.formControllersPage.disableToggle(this.showProcessFilterIconsToggle);
        return this;
    }

}
