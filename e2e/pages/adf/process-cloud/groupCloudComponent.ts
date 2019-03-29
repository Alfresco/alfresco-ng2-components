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

import { by, element, protractor } from 'protractor';
import { Util } from '../../../util/util';

export class GroupCloudComponent {

    groupCloudSearch = element(by.css('input[data-automation-id="adf-cloud-group-search-input"]'));

    searchGroups(name) {
        Util.waitUntilElementIsVisible(this.groupCloudSearch);
        this.groupCloudSearch.clear().then(() => {
            for (let i = 0; i < name.length; i++) {
                this.groupCloudSearch.sendKeys(name[i]);
            }
            this.groupCloudSearch.sendKeys(protractor.Key.BACK_SPACE);
            this.groupCloudSearch.sendKeys(name[name.length - 1]);
        });
        return this;
    }

    selectGroupFromList(name) {
        let groupRow = element.all(by.cssContainingText('mat-option span', name)).first();
        Util.waitUntilElementIsVisible(groupRow);
        groupRow.click();
        Util.waitUntilElementIsNotVisible(groupRow);
        return this;
    }

    checkGroupIsDisplayed(name) {
        let groupRow = element.all(by.cssContainingText('mat-option span', name)).first();
        Util.waitUntilElementIsVisible(groupRow);
        return this;
    }

    checkGroupIsNotDisplayed(name) {
        let groupRow = element.all(by.cssContainingText('mat-option span', name)).first();
        Util.waitUntilElementIsNotVisible(groupRow);
        return this;
    }

    checkSelectedGroup(group) {
        Util.waitUntilElementIsVisible(element(by.cssContainingText('mat-chip[data-automation-id*="adf-cloud-group-chip-"]', group)));
        return this;
    }

}
