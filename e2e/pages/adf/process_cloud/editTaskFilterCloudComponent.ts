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
import { EditTaskFilterDialog } from '../dialog/editTaskFilterDialog';
import { BrowserVisibility } from '@alfresco/adf-testing';

export class EditTaskFilterCloudComponent {

    customiseFilter = element(by.id('adf-edit-task-filter-title-id'));
    selectedOption = element.all(by.css('mat-option[class*="mat-selected"]')).first();
    assignment = element(by.css('mat-form-field[data-automation-id="assignment"] input'));
    saveButton = element(by.css('button[data-automation-id="Save"]'));
    saveAsButton = element(by.css('button[data-automation-id="Save as"]'));
    deleteButton = element(by.css('button[data-automation-id="Delete"]'));

    editTaskFilter = new EditTaskFilterDialog();

    editTaskFilterDialog() {
        return this.editTaskFilter;
    }

    clickCustomiseFilterHeader() {
        BrowserVisibility.waitUntilElementIsVisible(this.customiseFilter);
        this.customiseFilter.click();
        return this;
    }

    setStateFilterDropDown(option) {
        this.clickOnDropDownArrow('status');

        const stateElement = element.all(by.cssContainingText('mat-option span', option)).first();
        BrowserVisibility.waitUntilElementIsClickable(stateElement);
        BrowserVisibility.waitUntilElementIsVisible(stateElement);
        stateElement.click();
        return this;
    }

    getStateFilterDropDownValue() {
        return element(by.css("mat-form-field[data-automation-id='status'] span")).getText();
    }

    setSortFilterDropDown(option) {
        this.clickOnDropDownArrow('sort');

        const sortElement = element.all(by.cssContainingText('mat-option span', option)).first();
        BrowserVisibility.waitUntilElementIsClickable(sortElement);
        BrowserVisibility.waitUntilElementIsVisible(sortElement);
        sortElement.click();
        return this;
    }

    getSortFilterDropDownValue() {
        return element(by.css("mat-form-field[data-automation-id='sort'] span")).getText();
    }

    setOrderFilterDropDown(option) {
        this.clickOnDropDownArrow('order');

        const orderElement = element.all(by.cssContainingText('mat-option span', option)).first();
        BrowserVisibility.waitUntilElementIsClickable(orderElement);
        BrowserVisibility.waitUntilElementIsVisible(orderElement);
        orderElement.click();
        return this;
    }

    getOrderFilterDropDownValue() {
        return element(by.css("mat-form-field[data-automation-id='order'] span")).getText();
    }

    clickOnDropDownArrow(option) {
        const dropDownArrow = element(by.css("mat-form-field[data-automation-id='" + option + "'] div[class*='arrow']"));
        BrowserVisibility.waitUntilElementIsVisible(dropDownArrow);
        dropDownArrow.click();
        BrowserVisibility.waitUntilElementIsVisible(this.selectedOption);
    }

    setAssignment(option) {
        BrowserVisibility.waitUntilElementIsVisible(this.assignment);
        this.assignment.clear();
        this.assignment.sendKeys(option);
        this.assignment.sendKeys(protractor.Key.ENTER);
        return this;
    }

    getAssignment() {
        return this.assignment.getText();
    }

    checkSaveButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this;
    }

    checkSaveAsButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton);
        return this;
    }

    checkDeleteButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.deleteButton);
        return this;
    }

    checkSaveButtonIsEnabled() {
        return this.saveButton.isEnabled();
    }

    checkSaveAsButtonIsEnabled() {
        return this.saveAsButton.isEnabled();
    }

    checkDeleteButtonIsEnabled() {
        return this.deleteButton.isEnabled();
    }

    clickSaveAsButton() {
        BrowserVisibility.waitUntilElementIsClickable(this.saveAsButton);
        BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton);
        this.saveAsButton.click();
        return this.editTaskFilter;
    }

    clickDeleteButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.deleteButton);
        this.deleteButton.click();
        return this;
    }

    clickSaveButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        this.saveButton.click();
        return this;
    }

}
