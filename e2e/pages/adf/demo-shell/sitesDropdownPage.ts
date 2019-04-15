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

import { BrowserVisibility } from '@alfresco/adf-testing';
import { element, by, ElementFinder } from 'protractor';

export class SitesDropdownPage {

    rootElement: ElementFinder;
    dropDownPanel = element(by.css(`div[class*='mat-select-panel']`));

    constructor(rootElement: ElementFinder = element(by.css(`mat-select[data-automation-id='site-my-files-option']`))) {
        this.rootElement = rootElement;
    }

    selectLocation(option) {
        BrowserVisibility.waitUntilElementIsVisible(this.rootElement);
        this.rootElement.click();
        BrowserVisibility.waitUntilElementIsVisible(this.dropDownPanel);
        return element(by.cssContainingText(`mat-option`, option)).click();
    }

    checkSelectedSiteIsDisplayed(siteName) {
        BrowserVisibility.waitUntilElementIsVisible(this.rootElement.element(by.cssContainingText('.mat-select-value-text span', siteName)));
    }

}
