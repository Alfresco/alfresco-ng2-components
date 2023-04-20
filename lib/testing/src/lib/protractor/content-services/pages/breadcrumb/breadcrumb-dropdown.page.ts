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

import { $, $$ } from 'protractor';
import { BrowserActions } from '../../../core/utils/browser-actions';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';
import { DropdownPage } from '../../../core/pages/material/dropdown.page';

export class BreadcrumbDropdownPage {

    breadCrumb = $(`adf-dropdown-breadcrumb[data-automation-id='content-node-selector-content-breadcrumb']`);
    parentFolder = this.breadCrumb.$(`button[data-automation-id='dropdown-breadcrumb-trigger']`);
    currentFolder = this.breadCrumb.$(`div span[data-automation-id="current-folder"]`);

    breadCrumbDropdown = new DropdownPage($$(`div[class*='mat-select-panel']`).first());

    async choosePath(pathName: string): Promise<void> {
        await this.breadCrumbDropdown.selectOption(pathName);
    }

    async clickParentFolder(): Promise<void> {
        await BrowserActions.click(this.parentFolder);
    }

    async checkBreadCrumbDropdownIsDisplayed(): Promise<void> {
        await this.breadCrumbDropdown.checkDropdownIsVisible();
    }

    async checkBreadCrumbDropdownIsNotDisplayed(): Promise<void> {
        await this.breadCrumbDropdown.checkDropdownIsNotVisible();
    }

    async checkBreadCrumbOptionIsDisplayed(optionName: string): Promise<void> {
        await this.breadCrumbDropdown.checkOptionIsDisplayed(optionName);
    }

    async checkBreadCrumbOptionIsNotDisplayed(optionName: string): Promise<void> {
        await this.breadCrumbDropdown.checkOptionIsNotDisplayed(optionName);
    }

    async getTextOfCurrentFolder(): Promise<string> {
        return BrowserActions.getText(this.currentFolder);
    }

    async checkCurrentFolderIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.currentFolder);
    }
}
