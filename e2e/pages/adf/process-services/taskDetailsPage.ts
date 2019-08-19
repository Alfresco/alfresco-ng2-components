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

import { AppSettingsToggles } from './dialog/appSettingsToggles';
import { element, by, browser, ElementFinder } from 'protractor';
import { TabsPage } from '@alfresco/adf-testing';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class TaskDetailsPage {

    appSettingsTogglesClass = new AppSettingsToggles();

    formContent: ElementFinder = element(by.css('adf-form'));
    formNameField: ElementFinder = element(by.css('span[data-automation-id*="formName"] span'));
    assigneeField: ElementFinder = element(by.css('span[data-automation-id*="assignee"] span'));
    statusField: ElementFinder = element(by.css('span[data-automation-id*="status"] span'));
    categoryField: ElementFinder = element(by.css('span[data-automation-id*="category"] span'));
    parentNameField: ElementFinder = element(by.css('span[data-automation-id*="parentName"] span'));
    parentTaskIdField: ElementFinder = element(by.css('span[data-automation-id*="parentTaskId"] span'));
    durationField: ElementFinder = element(by.css('span[data-automation-id*="duration"] span'));
    endDateField: ElementFinder = element.all(by.css('span[data-automation-id*="endDate"] span')).first();
    createdField: ElementFinder = element(by.css('span[data-automation-id="card-dateitem-created"] span'));
    idField: ElementFinder = element.all(by.css('span[data-automation-id*="id"] span')).first();
    descriptionField: ElementFinder = element(by.css('span[data-automation-id*="description"] span'));
    dueDateField: ElementFinder = element(by.css('span[data-automation-id*="dueDate"] span'));
    activitiesTitle: ElementFinder = element(by.css('div[class*="adf-info-drawer-layout-header-title"] div'));
    commentField: ElementFinder = element(by.id('comment-input'));
    addCommentButton: ElementFinder = element(by.css('[data-automation-id="comments-input-add"]'));
    involvePeopleButton: ElementFinder = element(by.css('div[class*="add-people"]'));
    addPeopleField: ElementFinder = element(by.css('input[data-automation-id="adf-people-search-input"]'));
    addInvolvedUserButton: ElementFinder = element(by.css('button[id="add-people"] span'));
    emailInvolvedUser = by.xpath('following-sibling::div[@class="adf-people-email"]');
    taskDetailsInfoDrawer: ElementFinder = element(by.tagName('adf-info-drawer'));
    taskDetailsSection: ElementFinder = element(by.css('div[data-automation-id="adf-tasks-details"]'));
    taskDetailsEmptySection: ElementFinder = element(by.css('div[data-automation-id="adf-tasks-details--empty"]'));
    completeTask: ElementFinder = element(by.css('button[id="adf-no-form-complete-button"]'));
    completeFormTask: ElementFinder = element(by.css('button[id="adf-form-complete"]'));
    taskDetailsTitle: ElementFinder = element(by.css('h2[class="adf-activiti-task-details__header"] span'));
    auditLogButton: ElementFinder = element(by.css('button[adf-task-audit]'));
    noPeopleInvolved: ElementFinder = element(by.id('no-people-label'));
    cancelInvolvePeopleButton: ElementFinder = element(by.id('close-people-search'));
    involvePeopleHeader: ElementFinder = element(by.css('div[class="adf-search-text-header"]'));
    removeInvolvedPeople: ElementFinder = element(by.css('button[data-automation-id="Remove"]'));
    peopleTitle: ElementFinder = element(by.id('people-title'));
    attachFormDropdown: ElementFinder = element(by.css('div[class="adf-attach-form-row"]'));
    cancelAttachForm: ElementFinder = element(by.id('adf-no-form-cancel-button'));
    attachFormButton: ElementFinder = element(by.id('adf-no-form-attach-form-button'));
    disabledAttachFormButton: ElementFinder = element(by.css('button[id="adf-no-form-attach-form-button"][disabled]'));
    removeAttachForm: ElementFinder = element(by.id('adf-no-form-remove-button'));
    attachFormName: ElementFinder = element(by.css('span[class="adf-form-title ng-star-inserted"]'));
    emptyTaskDetails: ElementFinder = element(by.css('adf-task-details > div > div'));

    async checkEditableAssigneeIsNotDisplayed(): Promise<void> {
        const editableAssignee = element(by.css('span[data-automation-id="card-textitem-value-assignee"][class*="clickable"]'));
        await BrowserVisibility.waitUntilElementIsNotVisible(editableAssignee);
    }

    async checkEditableFormIsNotDisplayed(): Promise<void> {
        const editableForm = element(by.css('span[data-automation-id="card-textitem-value-formName"][class*="clickable"]'));
        await BrowserVisibility.waitUntilElementIsNotVisible(editableForm);
    }

    async checkEditDescriptionButtonIsNotDisplayed(): Promise<void> {
        const editDescriptionButton = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-description"]'));
        await BrowserVisibility.waitUntilElementIsNotVisible(editDescriptionButton);
    }

    async checkEditPriorityButtonIsNotDisplayed(): Promise<void> {
        const editPriorityButton = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-priority"]'));
        await BrowserVisibility.waitUntilElementIsNotVisible(editPriorityButton);
    }

    async checkDueDatePickerButtonIsNotDisplayed(): Promise<void> {
        const dueDatePickerButton = element(by.css('mat-datetimepicker-toggle[data-automation-id="datepickertoggle-dueDate"]'));
        await BrowserVisibility.waitUntilElementIsNotVisible(dueDatePickerButton);
    }

    getTaskDetailsTitle(): Promise<string> {
        return BrowserActions.getText(this.taskDetailsTitle);
    }

    async checkSelectedForm(formName): Promise<void> {
        const text = await BrowserActions.getText(this.attachFormName);
        await expect(formName).toEqual(text);
    }

    async checkAttachFormButtonIsDisabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.disabledAttachFormButton);
    }

    async checkAttachFormButtonIsEnabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.attachFormButton);
    }

    async checkAttachFormDropdownIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.attachFormDropdown);
    }

    async clickAttachFormDropdown(): Promise<void> {
        await BrowserActions.click(this.attachFormDropdown);
    }

    async selectAttachFormOption(option): Promise<void> {
        const selectedOption: ElementFinder = element(by.cssContainingText('mat-option[role="option"]', option));
        await BrowserActions.click(selectedOption);
    }

    async checkCancelAttachFormIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.cancelAttachForm);
    }

    async noFormIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.formContent);
    }

    async clickCancelAttachForm(): Promise<void> {
        await BrowserActions.click(this.cancelAttachForm);
    }

    async checkRemoveAttachFormIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.removeAttachForm);
    }

    async clickRemoveAttachForm(): Promise<void> {
        await BrowserActions.click(this.removeAttachForm);
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

    async checkFormIsAttached(formName): Promise<void> {
        const attachedFormName = await BrowserActions.getText(this.formNameField);
        await expect(attachedFormName).toEqual(formName);
    }

    getFormName(): Promise<string> {
        return BrowserActions.getText(this.formNameField);
    }

    async clickForm(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.formNameField);
    }

    getAssignee(): Promise<string> {
        return BrowserActions.getText(this.assigneeField);
    }

    getStatus(): Promise<string> {
        return BrowserActions.getText(this.statusField);
    }

    getCategory(): Promise<string> {
        return BrowserActions.getText(this.categoryField);
    }

    getParentName(): Promise<string> {
        return BrowserActions.getText(this.parentNameField);
    }

    getParentTaskId(): Promise<string> {
        return BrowserActions.getText(this.parentTaskIdField);
    }

    getDuration(): Promise<string> {
        return BrowserActions.getText(this.durationField);
    }

    getEndDate(): Promise<string> {
        return BrowserActions.getText(this.endDateField);
    }

    getCreated(): Promise<string> {
        return BrowserActions.getText(this.createdField);
    }

    getId(): Promise<string> {
        return BrowserActions.getText(this.idField);
    }

    getDescription(): Promise<string> {
        return BrowserActions.getText(this.descriptionField);
    }

    getDueDate(): Promise<string> {
        return BrowserActions.getText(this.dueDateField);
    }

    getTitle(): Promise<string> {
        return BrowserActions.getText(this.activitiesTitle);
    }

    async selectActivityTab(): Promise<void> {
        const tabsPage: TabsPage = new TabsPage;
        await tabsPage.clickTabByTitle('Activity');
    }

    async selectDetailsTab(): Promise<void> {
        const tabsPage: TabsPage = new TabsPage;
        await tabsPage.clickTabByTitle('Details');
    }

    async addComment(comment): Promise<void> {
        await BrowserActions.clearSendKeys(this.commentField, comment);
        await BrowserActions.click(this.addCommentButton);
    }

    async checkCommentIsDisplayed(comment): Promise<void> {
        const row: ElementFinder = element(by.cssContainingText('div[id="comment-message"]', comment));
        await BrowserVisibility.waitUntilElementIsVisible(row);
    }

    async clickInvolvePeopleButton(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.involvePeopleButton);
        await BrowserVisibility.waitUntilElementIsClickable(this.involvePeopleButton);
        await browser.actions().mouseMove(this.involvePeopleButton).perform();
        await BrowserActions.click(this.involvePeopleButton);
    }

    async typeUser(user): Promise<void> {
        await BrowserActions.clearSendKeys(this.addPeopleField, user);
    }

    async selectUserToInvolve(user): Promise<void> {
        const row = this.getRowsUser(user);
        await BrowserActions.click(row);
    }

    async checkUserIsSelected(user): Promise<void> {
        const row: ElementFinder = element(by.cssContainingText('div[class*="search-list-container"] div[class*="people-full-name"]', user));
        await BrowserVisibility.waitUntilElementIsVisible(row);
    }

    async clickAddInvolvedUserButton(): Promise<void> {
        await BrowserActions.click(this.addInvolvedUserButton);
    }

    getRowsUser(user) {
        return element(by.cssContainingText('div[class*="people-full-name"]', user));
    }

    async removeInvolvedUser(user): Promise<void> {
        const row = this.getRowsUser(user).element(by.xpath('ancestor::div[contains(@class, "adf-datatable-row")]'));
        await BrowserActions.click(row.element(by.css('button[data-automation-id="action_menu_0"]')));
        await BrowserVisibility.waitUntilElementIsVisible(this.removeInvolvedPeople);
        await BrowserActions.click(this.removeInvolvedPeople);

    }

    async getInvolvedUserEmail(user): Promise<string> {
        const row = this.getRowsUser(user);
        const email = row.element(this.emailInvolvedUser);
        return BrowserActions.getText(email);
    }

    async clickAuditLogButton(): Promise<void> {
        await BrowserActions.click(this.auditLogButton);
    }

    appSettingsToggles(): AppSettingsToggles {
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
        await BrowserVisibility.waitUntilElementIsVisible(this.addPeopleField);
        return this.addPeopleField.getAttribute('placeholder');
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

}
