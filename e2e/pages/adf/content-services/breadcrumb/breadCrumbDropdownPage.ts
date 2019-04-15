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
import { BrowserVisibility } from '@alfresco/adf-testing';

export class BreadCrumbDropdownPage {

    rootElement: ElementFinder;
    parentFolder;
    breadCrumbDropdown = element(by.css(`div[class*='mat-select-panel']`));
    currentFolder;

    constructor(rootElement: ElementFinder = element(by.css(`adf-dropdown-breadcrumb[data-automation-id='content-node-selector-content-breadcrumb']`))) {
        this.rootElement = rootElement;
        this.parentFolder = this.rootElement.element(by.css(`button[data-automation-id='dropdown-breadcrumb-trigger']`));
        this.currentFolder = this.rootElement.element(by.css(`span[data-automation-id='current-folder']`));
    }

    choosePath(pathName) {
        const path = this.breadCrumbDropdown.element(by.cssContainingText(`mat-option[data-automation-class='dropdown-breadcrumb-path-option'] span[class='mat-option-text']`,
            pathName));
        BrowserVisibility.waitUntilElementIsVisible(path);
        return path.click();
    }

    clickParentFolder() {
        BrowserVisibility.waitUntilElementIsVisible(this.parentFolder);
        return this.parentFolder.click();
    }

    checkBreadCrumbDropdownIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.breadCrumbDropdown);
    }

    getCurrentFolder() {
        BrowserVisibility.waitUntilElementIsVisible(this.currentFolder);
        return this.currentFolder.getText();
    }

}
