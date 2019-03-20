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

import { Util } from '../../../../util/util';
import { element, by } from 'protractor';

export class BreadCrumbDropdownPage {

    breadCrumb = element(by.css(`adf-dropdown-breadcrumb[data-automation-id='content-node-selector-content-breadcrumb']`));
    parentFolder = this.breadCrumb.element(by.css(`button[data-automation-id='dropdown-breadcrumb-trigger']`));
    breadCrumbDropdown = element(by.css(`div[class*='mat-select-panel']`));

    choosePath(pathName) {
        let path = element(by.cssContainingText(`mat-option[data-automation-class='dropdown-breadcrumb-path-option'] span[class='mat-option-text']`,
            pathName));
        Util.waitUntilElementIsVisible(path);
        return path.click();

    }

    clickParentFolder() {
        Util.waitUntilElementIsVisible(this.parentFolder);
        return this.parentFolder.click();
    }

    checkBreadCrumbDropdownIsDisplayed() {
        Util.waitUntilElementIsVisible(this.breadCrumbDropdown);
    }
}
