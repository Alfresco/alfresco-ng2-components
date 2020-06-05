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

import { BrowserActions, BrowserVisibility, DropdownPage, TabsPage } from '@alfresco/adf-testing';
import { browser, by, element, Key } from 'protractor';
import { AppSettingsTogglesPage } from './dialog/app-settings-toggles.page';

export class TaskDetailsPage {

    appSettingsTogglesClass = new AppSettingsTogglesPage();

    formContent = element(by.css('adf-form'));
    formNameField = element(by.css('[data-automation-id="card-textitem-value-formName"]'));
    formNameButton = element(by.css('[data-automation-id="card-textitem-toggle-formName"]'));
    assigneeField = element(by.css('[data-automation-id="card-textitem-value-assignee"]'));
    assigneeButton = element(by.css('[data-automation-id="card-textitem-toggle-assignee"]'));
    statusField = element(by.css('[data-automation-id="card-textitem-value-status"]'));
    categoryField = element(by.css('[data-automation-id="card-textitem-value-category"] '));
    parentNameField = element(by.css('span[data-automation-id*="parentName"] span'));
    parentTaskIdField = element(by.css('[data-automation-id="card-textitem-value-parentTaskId"] '));
    durationField = element(by.css('[data-automation-id="card-textitem-value-duration"] '));
    endDateField = element.all(by.css('span[data-automation-id*="endDate"] span')).first();
    createdField = element(by.css('span[data-automation-id="card-dateitem-created"] span'));
    idField = element.all(by.css('[data-automation-id="card-textitem-value-id"]')).first();
    descriptionField = element(by.css('[data-automation-id="card-textitem-value-description"]'));
    dueDateField = element.all(by.css('span[data-automation-id*="dueDate"] span')).first();
    activitiesTitle = element(by.css('div[class*="adf-info-drawer-layout-header-title"] div'));
    commentField = element(by.id('comment-input'));
    addCommentButton = element(by.css('[data-automation-id="comments-input-add"]'));
    involvePeopleButton = element(by.css('div[class*="add-people"]'));
    addPeopleField = element(by.css('input[data-automation-id="adf-people-search-input"]'));
    addInvolvedUserButton = element(by.css('button[id="add-people"] span'));
    emailInvolvedUser = by.xpath('following-sibling::div[@class="adf-people-email"]');
    taskDetailsInfoDrawer = element(by.tagName('adf-info-drawer'));
    taskDetailsSection = element(by.css('div[data-automation-id="app-tasks-details"]'));
    taskDetailsEmptySection = element(by.css('div[data-automation-id="adf-tasks-details--empty"]'));
    completeTask = element(by.css('button[id="adf-no-form-complete-button"]'));
    completeFormTask = element(by.css('button[id="adf-form-complete"]'));
    taskDetailsTitle = element(by.css('.adf-activiti-task-details__header span'));
    auditLogButton = element(by.css('button[adf-task-audit]'));
    noPeopleInvolved = element(by.id('no-people-label'));
    cancelInvolvePeopleButton = element(by.id('close-people-search'));
    involvePeopleHeader = element(by.css('.adf-search-text-header'));
    removeInvolvedPeople = element(by.css('button[data-automation-id="Remove"]'));
    peopleTitle = element(by.id('people-title'));
    noFormMessage = element(by.css('span[id*="no-form-message"]'));
    cancelAttachForm = element(by.id('adf-no-form-cancel-button'));
    attachFormButton = element(by.id('adf-no-form-attach-form-button'));
    disabledAttachFormButton = element(by.css('button[id="adf-no-form-attach-form-button"][disabled]'));
    removeAttachForm = element(by.id('adf-attach-form-remove-button'));
    attachFormName = element(by.css('.adf-form-title'));
    emptyTaskDetails = element(by.css('adf-task-details > div > div'));
    priority = element(by.css('[data-automation-id*="card-textitem-value-priority"]'));
    editableAssignee = element(by.css('[data-automation-id="card-textitem-value-assignee"][class*="clickable"]'));
    claimElement = element(by.css('[data-automation-id="header-claim-button"]'));
    releaseElement = element(by.css('[data-automation-id="header-unclaim-button"]'));
    saveFormButton = element(by.css('button[id="adf-form-save"]'));

    attachFormDropdown = new DropdownPage(element(by.css('.adf-attach-form-row')));

    async checkEditableAssigneeIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.editableAssignee);
    }

    async checkEditableFormIsNotDisplayed(): Promise<void> {
        const editableForm = element(by.css('[data-automation-id="card-textitem-value-formName"][class*="clickable"]'));
        await BrowserVisibility.waitUntilElementIsNotVisible(editableForm);
    }

    async checkDueDatePickerButtonIsNotDisplayed(): Promise<void> {
        const dueDatePickerButton = element(by.css('mat-datetimepicker-toggle[data-automation-id="datepickertoggle-dueDate"]'));
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
        const attachedFormName = await BrowserActions.getInputValue(this.formNameField);
        await expect(attachedFormName).toEqual(formName);
    }

    getFormName(): Promise<string> {
        return BrowserActions.getInputValue(this.formNameField);
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
        await BrowserVisibility.waitUntilElementIsPresent(this.descriptionField);
        return this.descriptionField.getAttribute('placeholder');
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
        await BrowserActions.clearSendKeys(element(by.css('input[data-automation-id="card-textitem-value-priority"]')), priority ? priority : ' ');
        await this.priority.sendKeys(Key.TAB);
    }

    async updateDueDate(): Promise<void> {
        await BrowserActions.click(this.dueDateField);
        await BrowserActions.click(element.all(by.css('.mat-datetimepicker-calendar-body-cell')).first());
    }

    async updateDescription(description?: string): Promise<void> {
        await BrowserActions.click(this.descriptionField);
        await BrowserActions.clearWithBackSpace(this.descriptionField);
        await BrowserActions.clearSendKeys(element(by.css('[data-automation-id="card-textitem-value-description"]')), description ? description : '');
        await this.descriptionField.sendKeys(Key.TAB);
    }

    async updateAssignee(fullName: string): Promise<void> {
        await BrowserActions.click(this.assigneeButton);
        await BrowserActions.clearSendKeys(element(by.css('[id="userSearchText"]')), fullName);
        await BrowserActions.click(element(by.cssContainingText('.adf-people-full-name', fullName)));
        await BrowserActions.click(element(by.css('button[id="add-people"]')));
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

    async addComment(comment: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.commentField, comment);
        await BrowserActions.click(this.addCommentButton);
    }

    async checkCommentIsDisplayed(comment: string): Promise<void> {
        const row = element(by.cssContainingText('div[id="comment-message"]', comment));
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
        const row = element(by.cssContainingText('div[class*="search-list-container"] div[class*="people-full-name"]', user));
        await BrowserVisibility.waitUntilElementIsVisible(row);
    }

    async clickAddInvolvedUserButton(): Promise<void> {
        await BrowserActions.click(this.addInvolvedUserButton);
    }

    getRowsUser(user: string) {
        return element(by.cssContainingText('div[class*="people-full-name"]', user));
    }

    async removeInvolvedUser(user): Promise<void> {
        const row = this.getRowsUser(user).element(by.xpath('ancestor::adf-datatable-row[contains(@class, "adf-datatable-row")]'));
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
        await BrowserActions.clickScript(this.completeFormTask);
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
