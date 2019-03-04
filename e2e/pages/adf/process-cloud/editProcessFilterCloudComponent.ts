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
import { Util } from '../../../util/util';
import { by, element, protractor } from 'protractor';
import { EditProcessFilterDialog } from '../dialog/editProcessFilterDialog';

export class EditProcessFilterCloudComponent {

    customiseFilter = element(by.id('adf-edit-process-filter-title-id'));
    selectedOption = element(by.css('mat-option[class*="mat-selected"]'));

    saveButton = element(by.css('button[id="adf-save-id"]'));
    saveAsButton = element(by.css('button[id="adf-save-as-id"]'));
    deleteButton = element(by.css('button[id="adf-delete-id"]'));

    editProcessFilter = new EditProcessFilterDialog();

    editProcessFilterDialog() {
        return this.editProcessFilter;
    }

    clickCustomiseFilterHeader() {
        Util.waitUntilElementIsVisible(this.customiseFilter);
        this.customiseFilter.click();
        return this;
    }

    setStateFilterDropDown(option) {
        this.clickOnDropDownArrow('state');

        let stateElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsClickable(stateElement);
        Util.waitUntilElementIsVisible(stateElement);
        stateElement.click();
        return this;
    }

    getStateFilterDropDownValue() {
        return element(by.css("mat-form-field[data-automation-id='status'] span")).getText();
    }

    setSortFilterDropDown(option) {
        this.clickOnDropDownArrow('sort');

        let sortElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsClickable(sortElement);
        Util.waitUntilElementIsVisible(sortElement);
        sortElement.click();
        return this;
    }

    getSortFilterDropDownValue() {
        let sortLocator = element(by.css("mat-form-field[data-automation-id='sort'] span"));
        Util.waitUntilElementIsVisible(sortLocator);
        return sortLocator.getText();
    }

    setOrderFilterDropDown(option) {
        this.clickOnDropDownArrow('order');

        let orderElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsClickable(orderElement);
        Util.waitUntilElementIsVisible(orderElement);
        orderElement.click();
        return this;
    }

    getOrderFilterDropDownValue() {
        return element(by.css("mat-form-field[data-automation-id='order'] span")).getText();
    }

    clickOnDropDownArrow(option) {
        let dropDownArrow = element.all(by.css("mat-form-field[data-automation-id='" + option + "'] div[class*='arrow']")).first();
        Util.waitUntilElementIsVisible(dropDownArrow);
        Util.waitUntilElementIsClickable(dropDownArrow);
        dropDownArrow.click();
        Util.waitUntilElementIsVisible(this.selectedOption);
    }

    setProcessInstanceId(option) {
        return this.setProperty('processInstanceId', option);
    }

    getProcessInstanceId() {
        return this.getProperty('processInstanceId');
    }

    getProperty(property) {
        let locator = element.all(by.css('input[data-automation-id="adf-cloud-edit-process-property-' + property + '"]')).first();
        Util.waitUntilElementIsVisible(locator);
        return locator.getAttribute('value');
    }

    setProperty(property, option) {
        let locator = element.all(by.css('input[data-automation-id="adf-cloud-edit-process-property-' + property + '"]')).first();
        Util.waitUntilElementIsVisible(locator);
        locator.clear();
        locator.sendKeys(option);
        locator.sendKeys(protractor.Key.ENTER);
        return this;
    }

    checkSaveButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.saveButton);
        return this;
    }

    checkSaveAsButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.saveAsButton);
        return this;
    }

    checkDeleteButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.deleteButton);
        return this;
    }

    checkSaveButtonIsEnabled() {
        Util.waitUntilElementIsVisible(this.saveButton);
        return this.saveButton.isEnabled();
    }

    checkSaveAsButtonIsEnabled() {
        Util.waitUntilElementIsVisible(this.saveAsButton);
        return this.saveAsButton.isEnabled();
    }

    checkDeleteButtonIsEnabled() {
        Util.waitUntilElementIsVisible(this.deleteButton);
        return this.deleteButton.isEnabled();
    }

    clickSaveAsButton() {
        Util.waitUntilElementIsClickable(this.saveAsButton);
        Util.waitUntilElementIsVisible(this.saveAsButton);
        this.saveAsButton.click();
        return this.editProcessFilter;
    }

    clickDeleteButton() {
        Util.waitUntilElementIsVisible(this.deleteButton);
        this.deleteButton.click();
        return this;
    }

    clickSaveButton() {
        Util.waitUntilElementIsVisible(this.saveButton);
        this.saveButton.click();
        return this;
    }
}
