/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { BrowserActions, BrowserVisibility, DropdownPage, TabsPage } from '@alfresco/adf-testing';
import { browser, by, element, Key, $, $$ } from 'protractor';
import { AppSettingsTogglesPage } from './dialog/app-settings-toggles.page';

export class TaskDetailsPage {

    appSettingsTogglesClass = new AppSettingsTogglesPage();

    formContent = $('adf-form');

    formNameField = $('[data-automation-id="card-textitem-value-formName"]');
    formNameButton = $('[data-automation-id="card-textitem-toggle-formName"]');
    assigneeField = $('[data-automation-id="card-textitem-value-assignee"]');
    assigneeButton = $('[data-automation-id="card-textitem-toggle-assignee"]');
    statusField = $('[data-automation-id="card-textitem-value-status"]');
    categoryField = $('[data-automation-id="card-textitem-value-category"] ');
    parentNameField = $('span[data-automation-id*="parentName"] span');
    parentTaskIdField = $('[data-automation-id="card-textitem-value-parentTaskId"] ');
    durationField = $('[data-automation-id="card-textitem-value-duration"] ');
    endDateField = $$('span[data-automation-id*="endDate"] span').first();
    createdField = $('span[data-automation-id="card-dateitem-created"]');
    idField = $$('[data-automation-id="card-textitem-value-id"]').first();
    descriptionField = $('[data-automation-id="card-textitem-value-description"]');
    dueDateField = $$('span[data-automation-id*="dueDate"] span').first();
    activitiesTitle = $('div[class*="adf-info-drawer-layout-header-title"] div');
    commentField = $('#comment-input');
    addCommentButton = $('[data-automation-id="comments-input-add"]');
    involvePeopleButton = $('div[class*="add-people"]');
    addPeopleField = $('input[data-automation-id="adf-people-search-input"]');
    addInvolvedUserButton = $('button[id="add-people"]');
    taskDetailsInfoDrawer = element(by.tagName('adf-info-drawer'));
    taskDetailsSection = $('div[data-automation-id="app-tasks-details"]');
    taskDetailsEmptySection = $('div[data-automation-id="adf-tasks-details--empty"]');
    completeTask = $('button[id="adf-no-form-complete-button"]');
    completeFormTask = $('button[id="adf-form-complete"]');
    taskDetailsTitle = $('.adf-activiti-task-details__header span');
    auditLogButton = $('button[adf-task-audit]');
    noPeopleInvolved = $('#no-people-label');
    cancelInvolvePeopleButton = $('#close-people-search');
    involvePeopleHeader = $('.adf-search-text-header');
    removeInvolvedPeople = $('button[data-automation-id="Remove"]');
    peopleTitle = $('#people-title');
    noFormMessage = $('span[id*="no-form-message"]');
    cancelAttachForm = $('#adf-no-form-cancel-button');
    attachFormButton = $('#adf-no-form-attach-form-button');
    disabledAttachFormButton = $('button[id="adf-no-form-attach-form-button"][disabled]');
    removeAttachForm = $('#adf-attach-form-remove-button');
    attachFormName = $('.adf-form-title');
    emptyTaskDetails = $('adf-task-details > div > div');
    priority = $('[data-automation-id*="card-textitem-value-priority"]');
    editableAssignee = $('[data-automation-id="card-textitem-value-assignee"][class*="clickable"]');
    claimElement = $('[data-automation-id="header-claim-button"]');
    releaseElement = $('[data-automation-id="header-unclaim-button"]');
    saveFormButton = $('button[id="adf-form-save"]');

    attachFormDropdown = new DropdownPage($('.adf-attach-form-row'));

    async checkEditableAssigneeIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.editableAssignee);
    }

    async checkEditableFormIsNotDisplayed(): Promise<void> {
        const editableForm = $('[data-automation-id="card-textitem-value-formName"][class*="clickable"]');
        await BrowserVisibility.waitUntilElementIsNotVisible(editableForm);
    }

    async checkDueDatePickerButtonIsNotDisplayed(): Promise<void> {
        const dueDatePickerButton = $('mat-datetimepicker-toggle[data-automation-id="datepickertoggle-dueDate"]');
        await BrowserVisibility.waitUntilElementIsNotVisible(dueDatePickerButton);
    }

    getTaskDetailsTitle(): Promise<string> {
        return BrowserActions.getText(this.taskDetailsTitle);
    }

    async checkSelectedForm(formName): Promise<void> {
        await this.attachFormDropdown.checkOptionIsSelected(formName);
    }

    async checkAttachFormButtonIsDisabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.disabledAttachFormButton);
    }

    async checkAttachFormButtonIsEnabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.attachFormButton);
    }

    async checkAttachFormDropdownIsDisplayed(): Promise<void> {
        await this.attachFormDropdown.checkDropdownIsVisible();
    }

    async selectAttachFormOption(option): Promise<void> {
        await this.attachFormDropdown.selectDropdownOption(option);
    }

    async noFormIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.formContent);
    }

    async checkRemoveAttachFormIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.removeAttachForm);
    }

    async clickRemoveAttachForm(): Promise<void> {
        await BrowserActions.click(this.removeAttachForm);
        await browser.sleep(2000);
    }

    async checkAttachFormButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.attachFormButton);
    }

    async checkAttachFormButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.attachFormButton);
    }

    async clickAttachFormButton(): Promise<void> {
        return BrowserActions.click(this.attachFormButton);
    }

    async checkFormIsAttached(formName: string): Promise<void> {
        await BrowserVisibility.waitUntilElementHasValue(this.formNameField, formName);
    }

    getFormName(): Promise<string> {
        return BrowserActions.getInputValue(this.formNameField);
    }

    async waitFormNameEqual(formName: string): Promise<void> {
        await BrowserVisibility.waitUntilElementHasValue(this.formNameField, formName);
    }

    async clickForm(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.formNameButton);
    }

    async checkStandaloneNoFormMessageIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noFormMessage);
    }

    async getNoFormMessage(): Promise<string> {
        return BrowserActions.getText(this.noFormMessage);
    }

    getAssignee(): Promise<string> {
        return BrowserActions.getInputValue(this.assigneeField);
    }

    isAssigneeClickable(): Promise<string> {
        return BrowserVisibility.waitUntilElementIsVisible(this.editableAssignee);
    }

    getStatus(): Promise<string> {
        return BrowserActions.getInputValue(this.statusField);
    }

    getCategory(): Promise<string> {
        return BrowserActions.getInputValue(this.categoryField);
    }

    getParentName(): Promise<string> {
        return BrowserActions.getText(this.parentNameField);
    }

    getParentTaskId(): Promise<string> {
        return BrowserActions.getInputValue(this.parentTaskIdField);
    }

    getDuration(): Promise<string> {
        return BrowserActions.getInputValue(this.durationField);
    }

    getEndDate(): Promise<string> {
        return BrowserActions.getText(this.endDateField);
    }

    getCreated(): Promise<string> {
        return BrowserActions.getText(this.createdField);
    }

    getId(): Promise<string> {
        return BrowserActions.getInputValue(this.idField);
    }

    getDescription(): Promise<string> {
        return BrowserActions.getInputValue(this.descriptionField);
    }

    async getDescriptionPlaceholder(): Promise<string> {
        return BrowserActions.getAttribute(this.descriptionField, 'data-placeholder');
    }

    getDueDate(): Promise<string> {
        return BrowserActions.getText(this.dueDateField);
    }

    getPriority(): Promise<string> {
        return BrowserActions.getInputValue(this.priority);
    }

    async updatePriority(priority?: string): Promise<void> {
        await BrowserActions.click(this.priority);
        await BrowserActions.clearWithBackSpace(this.priority);
        await BrowserActions.clearSendKeys($('input[data-automation-id="card-textitem-value-priority"]'), priority, 500);
        await this.priority.sendKeys(Key.TAB);
        await browser.sleep(1000);
    }

    async updateDueDate(): Promise<void> {
        await BrowserActions.click(this.dueDateField);
        await BrowserActions.click($$('.mat-datetimepicker-calendar-body-cell').first());
        await browser.sleep(1000);
    }

    async updateDescription(description?: string): Promise<void> {
        await BrowserActions.click(this.descriptionField);
        await BrowserActions.clearWithBackSpace(this.descriptionField);
        await BrowserActions.clearSendKeys($('[data-automation-id="card-textitem-value-description"]'), description ? description : '');
        await this.descriptionField.sendKeys(Key.TAB);
        await browser.sleep(1000);
    }

    async updateAssignee(fullName: string): Promise<void> {
        await BrowserActions.click(this.assigneeButton);
        await BrowserActions.clearSendKeys($('[id="userSearchText"]'), fullName);
        await BrowserActions.click(element(by.cssContainingText('.adf-people-full-name', fullName)));
        await BrowserVisibility.waitUntilElementIsVisible($(`adf-datatable-row[class*='is-selected']`));

        await browser.sleep(2000);
        await BrowserActions.click($('button[id="add-people"]'));
    }

    getTitle(): Promise<string> {
        return BrowserActions.getText(this.activitiesTitle);
    }

    async selectActivityTab(): Promise<void> {
        const tabsPage: TabsPage = new TabsPage();
        await tabsPage.clickTabByTitle('Activity');
    }

    async selectDetailsTab(): Promise<void> {
        const tabsPage: TabsPage = new TabsPage();
        await tabsPage.clickTabByTitle('Details');
    }

    async addComment(comment: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.commentField, comment);
        await BrowserActions.click(this.addCommentButton);
    }

    async checkCommentIsDisplayed(comment: string): Promise<void> {
        const row = element(by.cssContainingText('div.adf-comment-message', comment));
        await BrowserVisibility.waitUntilElementIsVisible(row);
    }

    async checkIsEmptyCommentListDisplayed(): Promise<void> {
        const emptyList = element(by.cssContainingText('div[id="comment-header"]', '(0)'));
        await BrowserVisibility.waitUntilElementIsVisible(emptyList);
    }

    async clickInvolvePeopleButton(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.involvePeopleButton);
        await BrowserVisibility.waitUntilElementIsClickable(this.involvePeopleButton);
        await browser.actions().mouseMove(this.involvePeopleButton).perform();
        await BrowserActions.click(this.involvePeopleButton);
    }

    async typeUser(user: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.addPeopleField, user);
    }

    async selectUserToInvolve(user): Promise<void> {
        const row = this.getRowsUser(user);
        await BrowserActions.click(row);
    }

    async checkUserIsSelected(user: string): Promise<void> {
        const row = this.getRowsUser(user);
        await BrowserVisibility.waitUntilElementIsVisible(row);
        await browser.sleep(2000);
    }

    async clickAddInvolvedUserButton(): Promise<void> {
        await BrowserActions.click(this.addInvolvedUserButton);
    }

    getRowsUser(user: string) {
        return $(`div[data-automation-id="adf-people-full-name-${user.replace(' ', '-')}"]`);
    }

    async removeInvolvedUser(user): Promise<void> {
        const row = this.getRowsUser(user).element(by.xpath('ancestor::adf-datatable-row[contains(@class, "adf-datatable-row")]'));
        await BrowserActions.click(row.$('button[data-automation-id="action_menu_0"]'));
        await BrowserVisibility.waitUntilElementIsVisible(this.removeInvolvedPeople);
        await BrowserActions.click(this.removeInvolvedPeople);

    }

    async getInvolvedUserEmail(user): Promise<string> {
        return BrowserActions.getText($(`div[data-automation-id="adf-people-email-${user.replace(' ', '-')}"]`));
    }

    async clickAuditLogButton(): Promise<void> {
        await BrowserActions.click(this.auditLogButton);
    }

    appSettingsToggles(): AppSettingsTogglesPage {
        return this.appSettingsTogglesClass;
    }

    async taskInfoDrawerIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskDetailsInfoDrawer);
    }

    async taskInfoDrawerIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.taskDetailsInfoDrawer);
    }

    async checkNoPeopleIsInvolved(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noPeopleInvolved);
    }

    async clickCancelInvolvePeopleButton(): Promise<void> {
        await BrowserActions.click(this.cancelInvolvePeopleButton);
    }

    getInvolvePeopleHeader(): Promise<string> {
        return BrowserActions.getText(this.involvePeopleHeader);
    }

    async getInvolvePeoplePlaceholder(): Promise<string> {
        return BrowserActions.getAttribute(this.addPeopleField, 'data-placeholder');
    }

    async checkCancelButtonIsEnabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.cancelInvolvePeopleButton);
        await BrowserVisibility.waitUntilElementIsClickable(this.cancelInvolvePeopleButton);
    }

    async checkAddPeopleButtonIsEnabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.addInvolvedUserButton);
        await BrowserVisibility.waitUntilElementIsClickable(this.addInvolvedUserButton);
    }

    async noUserIsDisplayedInSearchInvolvePeople(user): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.cssContainingText('div[class*="people-full-name"]', user)));
    }

    getInvolvedPeopleTitle(): Promise<string> {
        return BrowserActions.getText(this.peopleTitle);
    }

    checkTaskDetailsEmpty(): Promise<string> {
        return BrowserActions.getText(this.taskDetailsEmptySection);
    }

    async checkTaskDetailsDisplayed(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskDetailsSection);
        await BrowserVisibility.waitUntilElementIsVisible(this.formNameField);
        await BrowserVisibility.waitUntilElementIsVisible(this.assigneeField);
        await BrowserVisibility.waitUntilElementIsVisible(this.statusField);
        await BrowserVisibility.waitUntilElementIsVisible(this.categoryField);
        await BrowserVisibility.waitUntilElementIsVisible(this.parentNameField);
        await BrowserVisibility.waitUntilElementIsVisible(this.createdField);
        await BrowserVisibility.waitUntilElementIsVisible(this.idField);
        await BrowserVisibility.waitUntilElementIsVisible(this.descriptionField);
        await BrowserVisibility.waitUntilElementIsVisible(this.dueDateField);
        await BrowserVisibility.waitUntilElementIsVisible(this.priority);
        await BrowserVisibility.waitUntilElementIsVisible(this.activitiesTitle);

        return BrowserActions.getText(this.taskDetailsSection);
    }

    async clickCompleteTask(): Promise<void> {
        await BrowserActions.click(this.completeTask);
    }

    async checkCompleteFormButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.completeFormTask);
    }

    async checkCompleteTaskButtonIsEnabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.completeTask);
    }

    async checkCompleteTaskButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.completeTask);
    }

    async clickCompleteFormTask(): Promise<void> {
        await BrowserActions.click(this.completeFormTask);
    }

    async getEmptyTaskDetailsMessage(): Promise<string> {
        return BrowserActions.getText(this.emptyTaskDetails);
    }

    async isCompleteButtonWithFormEnabled(): Promise<boolean> {
        return this.completeFormTask.isEnabled();
    }

    async checkClaimEnabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsPresent(this.claimElement);
    }

    async checkReleaseEnabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsPresent(this.releaseElement);
    }

    async claimTask(): Promise<void> {
        await BrowserActions.click(this.claimElement);
    }

    async releaseTask(): Promise<void> {
        await BrowserActions.click(this.releaseElement);
    }

    async saveTaskForm(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveFormButton);
        await BrowserActions.click(this.saveFormButton);
    }

}
