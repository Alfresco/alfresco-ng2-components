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

import { element, by, ElementFinder } from 'protractor';
import { BrowserActions, DropdownPage } from '@alfresco/adf-testing';

export class BreadCrumbDropdownPage {

    breadCrumb: ElementFinder = element(by.css(`adf-dropdown-breadcrumb[data-automation-id='content-node-selector-content-breadcrumb']`));
    parentFolder = this.breadCrumb.element(by.css(`button[data-automation-id='dropdown-breadcrumb-trigger']`));
    currentFolder = this.breadCrumb.element(by.css(`div span[data-automation-id="current-folder"]`));

    breadCrumbDropdown = new DropdownPage(element.all(by.css(`div[class*='mat-select-panel']`)).first());

    async choosePath(pathName): Promise<void> {
        await this.breadCrumbDropdown.selectOption(pathName);
    }

    async clickParentFolder(): Promise<void> {
        await BrowserActions.click(this.parentFolder);
    }

    async checkBreadCrumbDropdownIsDisplayed(): Promise<void> {
        await this.breadCrumbDropdown.checkDropdownIsVisible();
    }

    async getTextOfCurrentFolder(): Promise<string> {
        return BrowserActions.getText(this.currentFolder);
    }
}
