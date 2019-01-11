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

import { Util } from '../../../util/util';
import { by, element, protractor } from 'protractor';

export class EditTaskFilterCloudComponent {

    customiseFilter = element(by.id('adf-edit-task-filter-title-id'));
    selectedOption = element(by.css('mat-option[class*="mat-selected"]'));
    assignment = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-assignment"]'));
    statusBy = by.css('mat-select[data-automation-id="adf-cloud-edit-task-property-state"]');
    sortBy = by.css('mat-select[data-automation-id="adf-cloud-edit-task-property-sort"]');
    orderBy = by.css('mat-select[data-automation-id="adf-cloud-edit-task-property-order"]');

    clickCustomiseFilterHeader() {
        Util.waitUntilElementIsVisible(this.customiseFilter);
        this.customiseFilter.click();
        return this;
    }

    setStateFilterDropDown(option) {
        this.clickOnDropDownArrow(this.statusBy);

        let stateElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsClickable(stateElement);
        Util.waitUntilElementIsVisible(stateElement);
        stateElement.click();
        return this;
    }

    setSortFilterDropDown(option) {
        this.clickOnDropDownArrow(this.sortBy);

        let sortElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsClickable(sortElement);
        Util.waitUntilElementIsVisible(sortElement);
        sortElement.click();
        return this;
    }

    setOrderFilterDropDown(option) {
        this.clickOnDropDownArrow(this.orderBy);

        let orderElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsClickable(orderElement);
        Util.waitUntilElementIsVisible(orderElement);
        orderElement.click();
        return this;
    }

    clickOnDropDownArrow(option) {
        let dropDownArrow = element(option);
        Util.waitUntilElementIsVisible(dropDownArrow);
        dropDownArrow.click();
        Util.waitUntilElementIsVisible(this.selectedOption);
    }

    setAssignment(option) {
        Util.waitUntilElementIsVisible(this.assignment);
        this.assignment.clear();
        this.assignment.sendKeys(option);
        this.assignment.sendKeys(protractor.Key.ENTER);
        return this;
    }

}
