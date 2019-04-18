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

import { browser, by, element, protractor } from 'protractor';
import { BrowserVisibility } from '../../core/browser-visibility';

export class GroupCloudComponentPage {

    groupCloudSearch = element(by.css('input[data-automation-id="adf-cloud-group-search-input"]'));

    searchGroups(name) {
        BrowserVisibility.waitUntilElementIsVisible(this.groupCloudSearch);
        browser.sleep(1000);
        this.groupCloudSearch.clear().then(() => {
            for (let i = 0; i < name.length; i++) {
                this.groupCloudSearch.sendKeys(name[i]);
            }
            this.groupCloudSearch.sendKeys(protractor.Key.BACK_SPACE);
            this.groupCloudSearch.sendKeys(name[name.length - 1]);
        });
        return this;
    }

    searchGroupsToExisting(name) {
        BrowserVisibility.waitUntilElementIsVisible(this.groupCloudSearch);
        for (let i = 0; i < name.length; i++) {
            this.groupCloudSearch.sendKeys(name[i]);
        }
        this.groupCloudSearch.sendKeys(protractor.Key.BACK_SPACE);
        this.groupCloudSearch.sendKeys(name[name.length - 1]);
        return this;
    }

    getGroupsFieldContent() {
        BrowserVisibility.waitUntilElementIsVisible(this.groupCloudSearch);
        return this.groupCloudSearch.getAttribute('value');

    }

    selectGroupFromList(name) {
        const groupRow = element.all(by.cssContainingText('mat-option span', name)).first();
        BrowserVisibility.waitUntilElementIsVisible(groupRow);
        browser.sleep(1000);
        groupRow.click();
        BrowserVisibility.waitUntilElementIsNotVisible(groupRow);
        return this;
    }

    checkGroupIsDisplayed(name) {
        const groupRow = element.all(by.cssContainingText('mat-option span', name)).first();
        BrowserVisibility.waitUntilElementIsVisible(groupRow);
        return this;
    }

    checkGroupIsNotDisplayed(name) {
        const groupRow = element.all(by.cssContainingText('mat-option span', name)).first();
        BrowserVisibility.waitUntilElementIsNotVisible(groupRow);
        return this;
    }

    checkSelectedGroup(group) {
        BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('mat-chip[data-automation-id*="adf-cloud-group-chip-"]', group)));
        return this;
    }

}
