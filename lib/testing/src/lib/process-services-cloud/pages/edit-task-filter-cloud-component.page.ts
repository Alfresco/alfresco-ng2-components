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
import { EditTaskFilterDialogPage } from './dialog/edit-task-filter-dialog.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';

export class EditTaskFilterCloudComponentPage {

    customiseFilter = element(by.id('adf-edit-task-filter-title-id'));
    selectedOption = element.all(by.css('mat-option[class*="mat-selected"]')).first();
    assignee = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-assignee"]'));
    priority = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-priority"]'));
    taskName = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-taskName"]'));
    processDefinitionId = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-processDefinitionId"]'));
    processInstanceId = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-processInstanceId"]'));
    lastModifiedFrom = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-lastModifiedFrom"]'));
    lastModifiedTo = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-lastModifiedTo"]'));
    parentTaskId = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-parentTaskId"]'));
    owner = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-owner"]'));
    saveButton = element(by.css('[data-automation-id="adf-filter-action-save"]'));
    saveAsButton = element(by.css('[data-automation-id="adf-filter-action-saveAs"]'));
    deleteButton = element(by.css('[data-automation-id="adf-filter-action-delete"]'));

    editTaskFilterDialogPage = new EditTaskFilterDialogPage();

    editTaskFilterDialog() {
        return this.editTaskFilterDialogPage;
    }

    clickCustomiseFilterHeader() {
        BrowserVisibility.waitUntilElementIsVisible(this.customiseFilter);
        this.customiseFilter.click();
        return this;
    }

    setStatusFilterDropDown(option) {
        this.clickOnDropDownArrow('status');

        const statusElement = element.all(by.cssContainingText('mat-option span', option)).first();
        BrowserVisibility.waitUntilElementIsVisible(statusElement);
        BrowserVisibility.waitUntilElementIsClickable(statusElement);
        statusElement.click();
        return this;
    }

    getStatusFilterDropDownValue() {
        return element.all(by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-status'] span")).first().getText();
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
        const elementSort = element.all(by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-sort'] span")).first();
        BrowserVisibility.waitUntilElementIsVisible(elementSort);
        return elementSort.getText();
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
        return element.all(by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-order'] span")).first().getText();
    }

    clickOnDropDownArrow(option) {
        const dropDownArrow = element.all(by.css("mat-form-field[data-automation-id='" + option + "'] div[class*='arrow']")).first();
        BrowserVisibility.waitUntilElementIsVisible(dropDownArrow);
        dropDownArrow.click();
        BrowserVisibility.waitUntilElementIsVisible(this.selectedOption);
    }

    setAssignee(option) {
        return this.setProperty('assignee', option);
    }

    getAssignee() {
        return this.assignee.getText();
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
        BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this.saveButton.isEnabled();
    }

    checkSaveAsButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this.saveAsButton.isEnabled();
    }

    checkDeleteButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this.deleteButton.isEnabled();
    }

    clickSaveAsButton() {
        const disabledButton = element(by.css(("button[data-automation-id='adf-filter-action-saveAs'][disabled]")));
        BrowserVisibility.waitUntilElementIsClickable(this.saveAsButton);
        BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton);
        BrowserVisibility.waitUntilElementIsNotVisible(disabledButton);
        this.saveAsButton.click();
        return this.editTaskFilterDialogPage;
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

    clearAssignee() {
        this.clearField(this.assignee);
        return this;
    }

    clearField(locator) {
        BrowserVisibility.waitUntilElementIsVisible(locator);
        locator.getAttribute('value').then((result) => {
            for (let i = result.length; i >= 0; i--) {
                locator.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }

    setAppNameDropDown(option) {
        this.clickOnDropDownArrow('appName');

        const appNameElement = element.all(by.cssContainingText('mat-option span', option)).first();
        BrowserVisibility.waitUntilElementIsClickable(appNameElement);
        BrowserVisibility.waitUntilElementIsVisible(appNameElement);
        appNameElement.click();
        return this;
    }

    getAppNameDropDownValue() {
        const locator = element.all(by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-appName'] span")).first();
        BrowserVisibility.waitUntilElementIsVisible(locator);
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
        const locator = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-' + property + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(locator);
        locator.clear();
        locator.sendKeys(option);
        locator.sendKeys(protractor.Key.ENTER);
        return this;
    }

    getProcessInstanceId() {
        return this.processInstanceId.getAttribute('value');
    }

}
