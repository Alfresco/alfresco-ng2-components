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
import { EditTaskFilterDialogPage } from './dialog/edit-task-filter-dialog.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { ElementFinder } from 'protractor/built/element';

export class EditTaskFilterCloudComponentPage {

    customiseFilter: ElementFinder = element(by.id('adf-edit-task-filter-title-id'));
    selectedOption: ElementFinder = element.all(by.css('mat-option[class*="mat-selected"]')).first();
    assignee: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-assignee"]'));
    priority: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-priority"]'));
    taskName: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-taskName"]'));
    id: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-taskId"]'));
    processDefinitionId: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-processDefinitionId"]'));
    processInstanceId: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-processInstanceId"]'));
    lastModifiedFrom: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-lastModifiedFrom"]'));
    lastModifiedTo: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-lastModifiedTo"]'));
    parentTaskId: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-parentTaskId"]'));
    owner: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-owner"]'));
    saveButton: ElementFinder = element(by.css('[data-automation-id="adf-filter-action-save"]'));
    saveAsButton: ElementFinder = element(by.css('[data-automation-id="adf-filter-action-saveAs"]'));
    deleteButton: ElementFinder = element(by.css('[data-automation-id="adf-filter-action-delete"]'));

    editTaskFilterDialogPage = new EditTaskFilterDialogPage();

    editTaskFilterDialog() {
        return this.editTaskFilterDialogPage;
    }

    async clickCustomiseFilterHeader() {
        await BrowserActions.click(this.customiseFilter);
        return this;
    }

    async setStatusFilterDropDown(option) {
        this.clickOnDropDownArrow('status');

        const statusElement = element.all(by.cssContainingText('mat-option span', option)).first();
        await BrowserActions.click(statusElement);
        return this;
    }

    getStatusFilterDropDownValue(): Promise<string> {
        return BrowserActions.getText(element.all(by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-status'] span")).first());
    }

    async setSortFilterDropDown(option) {
        this.clickOnDropDownArrow('sort');

        const sortElement = element.all(by.cssContainingText('mat-option span', option)).first();
        await BrowserActions.click(sortElement);
        return this;
    }

    async getSortFilterDropDownValue(): Promise<string> {
        const elementSort = element.all(by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-sort'] span")).first();
        return BrowserActions.getText(elementSort);
    }

    async setOrderFilterDropDown(option) {
        this.clickOnDropDownArrow('order');

        const orderElement = element.all(by.cssContainingText('mat-option span', option)).first();
        await BrowserActions.click(orderElement);
        browser.sleep(1000);
        return this;
    }

    getOrderFilterDropDownValue(): Promise<string> {
        return BrowserActions.getText(element.all(by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-order'] span")).first());
    }

    async clickOnDropDownArrow(option) {
        const dropDownArrow = element.all(by.css("mat-form-field[data-automation-id='" + option + "'] div[class*='arrow']")).first();
        await BrowserActions.click(dropDownArrow);
        await BrowserVisibility.waitUntilElementIsVisible(this.selectedOption);
    }

    setAssignee(option) {
        return this.setProperty('assignee', option);
    }

    async getAssignee(): Promise<string> {
        return BrowserActions.getText(this.assignee);
    }

    setPriority(option) {
        return this.setProperty('priority', option);
    }

    async getPriority(): Promise<string> {
        return BrowserActions.getText(this.priority);
    }

    setParentTaskId(option) {
        return this.setProperty('parentTaskId', option);
    }

    async getParentTaskId(): Promise<string> {
        return BrowserActions.getText(this.parentTaskId);
    }

    setOwner(option) {
        return this.setProperty('owner', option);
    }

    async getOwner(): Promise<string> {
        return BrowserActions.getText(this.owner);
    }

    setLastModifiedFrom(option) {
        this.clearField(this.lastModifiedFrom);
        return this.setProperty('lastModifiedFrom', option);
    }

    async getLastModifiedFrom(): Promise<string> {
        return BrowserActions.getText(this.lastModifiedFrom);
    }

    setLastModifiedTo(option) {
        this.clearField(this.lastModifiedTo);
        return this.setProperty('lastModifiedTo', option);
    }

    async getLastModifiedTo(): Promise<string> {
        return BrowserActions.getText(this.lastModifiedTo);
    }

    async checkSaveButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this;
    }

    async checkSaveAsButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton);
        return this;
    }

    async checkDeleteButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.deleteButton);
        return this;
    }

    async checkSaveButtonIsEnabled() {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this.saveButton.isEnabled();
    }

    async checkSaveAsButtonIsEnabled() {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this.saveAsButton.isEnabled();
    }

    async checkDeleteButtonIsEnabled() {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this.deleteButton.isEnabled();
    }

    async clickSaveAsButton() {
        const disabledButton = element(by.css(("button[data-automation-id='adf-filter-action-saveAs'][disabled]")));
        await BrowserVisibility.waitUntilElementIsNotVisible(disabledButton);
        await BrowserActions.click(this.saveAsButton);
        return this.editTaskFilterDialogPage;
    }

    async clickDeleteButton() {
        await BrowserActions.click(this.deleteButton);
        return this;
    }

    async clickSaveButton() {
        await BrowserActions.click(this.saveButton);
        return this;
    }

    clearAssignee() {
        this.clearField(this.assignee);
        return this;
    }

    async clearField(locator) {
        await BrowserActions.clearSendKeys(locator, ' ');
        locator.sendKeys(protractor.Key.BACK_SPACE);
    }

    async setAppNameDropDown(option) {
        this.clickOnDropDownArrow('appName');

        const appNameElement = element.all(by.cssContainingText('mat-option span', option)).first();
        await BrowserActions.click(appNameElement);
        return this;
    }

    async getAppNameDropDownValue(): Promise<string> {
        const locator = element.all(by.css("mat-select[data-automation-id='adf-cloud-edit-task-property-appName'] span")).first();
        return BrowserActions.getText(locator);
    }

    setId(option) {
        return this.setProperty('taskId', option);
    }

    getId() {
        return this.id.getAttribute('value');
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

    async setProperty(property, option) {
        const locator = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-' + property + '"]'));
        await BrowserVisibility.waitUntilElementIsVisible(locator);
        locator.clear();
        locator.sendKeys(option);
        locator.sendKeys(protractor.Key.ENTER);
        return this;
    }

    getProcessInstanceId() {
        return this.processInstanceId.getAttribute('value');
    }

}
