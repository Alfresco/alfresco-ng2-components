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

export class PeopleCloudComponent {

    peopleCloudSearch = element(by.css('input[data-automation-id="adf-people-cloud-search-input"]'));

    searchAssigneeAndSelect(name) {
        Util.waitUntilElementIsVisible(this.peopleCloudSearch);
        this.peopleCloudSearch.clear();
        this.peopleCloudSearch.sendKeys(name);
        this.selectAssigneeFromList(name);
        return this;
    }

    searchAssignee(name) {
        Util.waitUntilElementIsVisible(this.peopleCloudSearch);
        this.peopleCloudSearch.clear().then(() => {
            for (let i = 0; i < name.length; i++) {
                this.peopleCloudSearch.sendKeys(name[i]);
            }
            this.peopleCloudSearch.sendKeys(protractor.Key.BACK_SPACE);
            this.peopleCloudSearch.sendKeys(name[name.length - 1]);
        });
        return this;
    }

    selectAssigneeFromList(name) {
        let assigneeRow = element(by.cssContainingText('mat-option span.adf-people-label-name', name));
        Util.waitUntilElementIsVisible(assigneeRow);
        assigneeRow.click();
        Util.waitUntilElementIsNotVisible(assigneeRow);
        return this;
    }

    getAssignee() {
        Util.waitUntilElementIsVisible(this.peopleCloudSearch);
        return this.peopleCloudSearch.getAttribute('value');
    }

    checkUserIsDisplayed(name) {
        let assigneeRow = element(by.cssContainingText('mat-option span.adf-people-label-name', name));
        Util.waitUntilElementIsVisible(assigneeRow);
        return this;
    }

    checkUserIsNotDisplayed(name) {
        let assigneeRow = element(by.cssContainingText('mat-option span.adf-people-label-name', name));
        Util.waitUntilElementIsNotVisible(assigneeRow);
        return this;
    }

    checkSelectedPeople(person) {
        Util.waitUntilElementIsVisible(element(by.cssContainingText('mat-chip-list mat-chip', person)));
        return this;
    }

}
