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
import { EditTaskFilterDialog } from '../dialog/editTaskFilterDialog';

export class EditTaskFilterCloudComponent {

    customiseFilter = element(by.id('adf-edit-task-filter-title-id'));
    selectedOption = element.all(by.css('mat-option[class*="mat-selected"]')).first();
    assignment = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-assignment"]'));
    priority = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-priority"]'));
    taskName = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-taskName"]'));
    processDefinitionId = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-processDefinitionId"]'));
    processInstanceId = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-processInstanceId"]'));
    lastModifiedFrom = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-lastModifiedFrom"]'));
    lastModifiedTo = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-lastModifiedTo"]'));
    parentTaskId = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-parentTaskId"]'));
    owner = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-owner"]'));
    saveButton = element(by.css('button[id="adf-save-id"]'));
    saveAsButton = element(by.css('button[id="adf-save-as-id"]'));
    deleteButton = element(by.css('button[id="adf-delete-id"]'));

    editTaskFilter = new EditTaskFilterDialog();

    editTaskFilterDialog() {
        return this.editTaskFilter;
    }

    clickCustomiseFilterHeader() {
        Util.waitUntilElementIsVisible(this.customiseFilter);
        this.customiseFilter.click();
        return this;
    }

    setStateFilterDropDown(option) {
        this.clickOnDropDownArrow('state');

        let stateElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsVisible(stateElement);
        Util.waitUntilElementIsClickable(stateElement);
        stateElement.click();
        return this;
    }

    getStateFilterDropDownValue() {
        return element.all(by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-state'] span")).first().getText();
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
        let elementSort = element.all(by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-sort'] span")).first();
        Util.waitUntilElementIsVisible(elementSort);
        return elementSort.getText();
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
        return element.all(by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-order'] span")).first().getText();
    }

    clickOnDropDownArrow(option) {
        let dropDownArrow = element.all(by.css("mat-form-field[data-automation-id='" + option + "'] div[class*='arrow']")).first();
        Util.waitUntilElementIsVisible(dropDownArrow);
        dropDownArrow.click();
        Util.waitUntilElementIsVisible(this.selectedOption);
    }

    setAssignment(option) {
        return this.setProperty('assignment', option);
    }

    getAssignment() {
        return this.assignment.getText();
    }

    setPriority(option) {
        return this.setProperty('priority', option);
    }

    getPriority() {
        return this.priority.getText();
    }

    setParentTaskId(option) {
        return this.setProperty('parentTaskId', option);
    }

    getParentTaskId() {
        return this.parentTaskId.getText();
    }

    setOwner(option) {
        return this.setProperty('owner', option);
    }

    getOwner() {
        return this.owner.getText();
    }

    setLastModifiedFrom(option) {
        this.clearField(this.lastModifiedFrom);
        return this.setProperty('lastModifiedFrom', option);
    }

    getLastModifiedFrom() {
        return this.lastModifiedFrom.getText();
    }

    setLastModifiedTo(option) {
        this.clearField(this.lastModifiedTo);
        return this.setProperty('lastModifiedTo', option);
    }

    getLastModifiedTo() {
        return this.lastModifiedTo.getText();
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
        Util.waitUntilElementIsVisible(this.saveButton);
        return this.saveAsButton.isEnabled();
    }

    checkDeleteButtonIsEnabled() {
        Util.waitUntilElementIsVisible(this.saveButton);
        return this.deleteButton.isEnabled();
    }

    clickSaveAsButton() {
        Util.waitUntilElementIsClickable(this.saveAsButton);
        Util.waitUntilElementIsVisible(this.saveAsButton);
        this.saveAsButton.click();
        return this.editTaskFilter;
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

    clearAssignment() {
        this.clearField(this.assignment);
        return this;
    }

    clearField(locator) {
        Util.waitUntilElementIsVisible(locator);
        locator.getAttribute('value').then((result) => {
            for (let i = result.length; i >= 0; i--) {
                locator.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }

    setAppNameDropDown(option) {
        this.clickOnDropDownArrow('appName');

        let appNameElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsClickable(appNameElement);
        Util.waitUntilElementIsVisible(appNameElement);
        appNameElement.click();
        return this;
    }

    getAppNameDropDownValue() {
        let locator = element.all(by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-appName'] span")).first();
        Util.waitUntilElementIsVisible(locator);
        return locator.getText();
    }

    setTaskName(option) {
        return this.setProperty('taskName', option);
    }

    getTaskName() {
        return this.taskName.getAttribute('value');
    }

    setProcessDefinitionId(option) {
        return this.setProperty('processDefinitionId', option);
    }

    getProcessDefinitionId() {
        return this.processDefinitionId.getAttribute('value');
    }

    setProcessInstanceId(option) {
        return this.setProperty('processInstanceId', option);
    }

    setProperty(property, option) {
        let locator = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-' + property + '"]'));
        Util.waitUntilElementIsVisible(locator);
        locator.clear();
        locator.sendKeys(option);
        locator.sendKeys(protractor.Key.ENTER);
        return this;
    }

    getProcessInstanceId() {
        return this.processInstanceId.getAttribute('value');
    }

}
