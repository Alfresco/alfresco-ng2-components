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

import {by, element} from "protractor";
import {Util} from "../../../util/util";

export class GroupCloudComponent {

    groupCloudSearch = element(by.css('input[data-automation-id="adf-cloud-group-search-input"]'));

    searchGroupAndSelect(name) {
        Util.waitUntilElementIsVisible(this.groupCloudSearch);
        this.groupCloudSearch.clear();
        this.groupCloudSearch.sendKeys(name);
        this.selectGroupFromList(name);
        return this;
    }

    searchGroups(name) {
        Util.waitUntilElementIsVisible(this.groupCloudSearch);
        this.groupCloudSearch.clear();
        this.groupCloudSearch.sendKeys(name);
        return this;
    }

    selectGroupFromList(name) {
        let groupRow = element(by.cssContainingText('mat-option span', name));
        Util.waitUntilElementIsVisible(groupRow);
        groupRow.click();
        Util.waitUntilElementIsNotVisible(groupRow);
        return this;
    }

    getGroup() {
        Util.waitUntilElementIsVisible(this.groupCloudSearch);
        return this.groupCloudSearch.getAttribute('value');
    }

    checkGroupIsDisplayed(name) {
        let groupRow = element(by.cssContainingText('mat-option span', name));
        Util.waitUntilElementIsVisible(groupRow);
        return this;
    }

    checkGroupIsNotDisplayed(name) {
        let groupRow = element(by.cssContainingText('mat-option span', name));
        Util.waitUntilElementIsNotVisible(groupRow);
        return this;
    }

    checkSelectedGroups = (selectedGroups: string[]) => {
        selectedGroups.forEach( (group) => {
            Util.waitUntilElementIsVisible(element(by.cssContainingText('mat-chip[data-automation-id*="adf-cloud-group-chip-"]', group)))
        })
        return this;

    };

}
