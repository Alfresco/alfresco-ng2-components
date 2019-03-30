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
import { element, by, protractor, browser } from 'protractor';
import { TabsPage } from '@alfresco/adf-testing';
import { BrowserVisibility } from '@alfresco/adf-testing';

export class TaskDetailsPage {

    appSettingsTogglesClass = new AppSettingsToggles();

    formContent = element(by.css('adf-form'));
    formNameField = element(by.css('span[data-automation-id*="formName"] span'));
    assigneeField = element(by.css('span[data-automation-id*="assignee"] span'));
    statusField = element(by.css('span[data-automation-id*="status"] span'));
    categoryField = element(by.css('span[data-automation-id*="category"] span'));
    parentNameField = element(by.css('span[data-automation-id*="parentName"] span'));
    parentTaskIdField = element(by.css('span[data-automation-id*="parentTaskId"] span'));
    durationField = element(by.css('span[data-automation-id*="duration"] span'));
    endDateField = element.all(by.css('span[data-automation-id*="endDate"] span')).first();
    createdField = element(by.css('span[data-automation-id="card-dateitem-created"] span'));
    idField = element.all(by.css('span[data-automation-id*="id"] span')).first();
    descriptionField = element(by.css('span[data-automation-id*="description"] span'));
    dueDateField = element(by.css('span[data-automation-id*="dueDate"] span'));
    activitiesTitle = element(by.css('div[class*="adf-info-drawer-layout-header-title"] div'));
    commentField = element(by.id('comment-input'));
    addCommentButton = element(by.css('[data-automation-id="comments-input-add"]'));
    involvePeopleButton = element(by.css('div[class*="add-people"]'));
    addPeopleField = element(by.css('input[data-automation-id="adf-people-search-input"]'));
    addInvolvedUserButton = element(by.css('button[id="add-people"] span'));
    emailInvolvedUser = by.xpath('following-sibling::div[@class="adf-people-email"]');
    editActionInvolvedUser = by.xpath('following-sibling::div[@class="adf-people-edit-label ng-star-inserted"]');
    involvedUserPic = by.xpath('ancestor::div/ancestor::div/preceding-sibling::div//div[@class="adf-people-search-people-pic ng-star-inserted"]');
    taskDetailsInfoDrawer = element(by.tagName('adf-info-drawer'));
    taskDetailsSection = element(by.css('div[data-automation-id="adf-tasks-details"]'));
    taskDetailsEmptySection = element(by.css('div[data-automation-id="adf-tasks-details--empty"]'));
    completeTask = element(by.css('button[id="adf-no-form-complete-button"]'));
    completeFormTask = element(by.css('button[id="adf-form-complete"]'));
    taskDetailsTitle = element(by.css('h2[class="adf-activiti-task-details__header"] span'));
    auditLogButton = element(by.css('button[adf-task-audit]'));
    noPeopleInvolved = element(by.id('no-people-label'));
    cancelInvolvePeopleButton = element(by.id('close-people-search'));
    involvePeopleHeader = element(by.css('div[class="adf-search-text-header"]'));
    removeInvolvedPeople = element(by.css('button[data-automation-id="Remove"]'));
    peopleTitle = element(by.id('people-title'));
    editFormButton = element.all(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-create"]')).last();
    attachFormDropdown = element(by.css('div[class="adf-attach-form-row"]'));
    cancelAttachForm = element(by.id('adf-no-form-cancel-button'));
    attachFormButton = element(by.id('adf-no-form-attach-form-button'));
    disabledAttachFormButton = element(by.css('button[id="adf-no-form-attach-form-button"][disabled]'));
    removeAttachForm = element(by.id('adf-no-form-remove-button'));
    attachFormName = element(by.css('span[class="adf-form-title ng-star-inserted"]'));
    emptyTaskDetails = element(by.css('adf-task-details > div > div'));

    getTaskDetailsTitle() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskDetailsTitle);
        return this.taskDetailsTitle.getText();
    }

    checkSelectedForm(formName) {
        BrowserVisibility.waitUntilElementIsVisible(this.attachFormName);
        expect(formName).toEqual(this.attachFormName.getText());
    }

    checkAttachFormButtonIsDisabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.disabledAttachFormButton);
    }

    checkAttachFormButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsClickable(this.attachFormButton);
    }

    checkEditFormButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.editFormButton);
    }

    clickEditFormButton() {
        BrowserVisibility.waitUntilElementIsClickable(this.editFormButton);
        return this.editFormButton.click();
    }

    checkAttachFormDropdownIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.attachFormDropdown);
    }

    clickAttachFormDropdown() {
        BrowserVisibility.waitUntilElementIsClickable(this.attachFormDropdown);
        return this.attachFormDropdown.click();
    }

    selectAttachFormOption(option) {
        const selectedOption = element(by.cssContainingText('mat-option[role="option"]', option));
        BrowserVisibility.waitUntilElementIsClickable(selectedOption);
        return selectedOption.click();
    }

    checkCancelAttachFormIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.cancelAttachForm);
    }

    noFormIsDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.formContent);
        return this;
    }

    clickCancelAttachForm() {
        BrowserVisibility.waitUntilElementIsClickable(this.cancelAttachForm);
        return this.cancelAttachForm.click();
    }

    checkRemoveAttachFormIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.removeAttachForm);
    }

    clickRemoveAttachForm() {
        BrowserVisibility.waitUntilElementIsClickable(this.removeAttachForm);
        return this.removeAttachForm.click();
    }

    checkAttachFormButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.attachFormButton);
    }

    checkAttachFormButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.attachFormButton);
    }

    clickAttachFormButton() {
        BrowserVisibility.waitUntilElementIsClickable(this.attachFormButton);
        return this.attachFormButton.click();
    }

    checkFormIsAttached(formName) {
        BrowserVisibility.waitUntilElementIsVisible(this.formNameField);
        this.formNameField.getText().then((attachedFormName) => {
            expect(attachedFormName).toEqual(formName);
        });
    }

    getFormName() {
        BrowserVisibility.waitUntilElementIsVisible(this.formNameField);
        return this.formNameField.getText();
    }

    getAssignee() {
        BrowserVisibility.waitUntilElementIsVisible(this.assigneeField);
        return this.assigneeField.getText();
    }

    getStatus() {
        BrowserVisibility.waitUntilElementIsVisible(this.statusField);
        return this.statusField.getText();
    }

    getCategory() {
        BrowserVisibility.waitUntilElementIsVisible(this.categoryField);
        return this.categoryField.getText();
    }

    getParentName() {
        BrowserVisibility.waitUntilElementIsVisible(this.parentNameField);
        return this.parentNameField.getText();
    }

    getParentTaskId() {
        BrowserVisibility.waitUntilElementIsVisible(this.parentTaskIdField);
        return this.parentTaskIdField.getText();
    }

    getDuration() {
        BrowserVisibility.waitUntilElementIsVisible(this.durationField);
        return this.durationField.getText();
    }

    getEndDate() {
        BrowserVisibility.waitUntilElementIsVisible(this.endDateField);
        return this.endDateField.getText();
    }

    getCreated() {
        BrowserVisibility.waitUntilElementIsVisible(this.createdField);
        return this.createdField.getText();
    }

    getId() {
        BrowserVisibility.waitUntilElementIsVisible(this.idField);
        return this.idField.getText();
    }

    getDescription() {
        BrowserVisibility.waitUntilElementIsVisible(this.descriptionField);
        return this.descriptionField.getText();
    }

    getDueDate() {
        BrowserVisibility.waitUntilElementIsVisible(this.dueDateField);
        return this.dueDateField.getText();
    }

    getTitle() {
        BrowserVisibility.waitUntilElementIsVisible(this.activitiesTitle);
        return this.activitiesTitle.getText();
    }

    selectActivityTab() {
        const tabsPage = new TabsPage;
        tabsPage.clickTabByTitle('Activity');
        return this;
    }

    selectDetailsTab() {
        const tabsPage = new TabsPage;
        tabsPage.clickTabByTitle('Details');
        return this;
    }

    addComment(comment) {
        BrowserVisibility.waitUntilElementIsVisible(this.commentField);
        this.commentField.sendKeys(comment);
        BrowserVisibility.waitUntilElementIsVisible(this.addCommentButton);
        this.addCommentButton.click();
        return this;
    }

    clearComment(comment) {
        BrowserVisibility.waitUntilElementIsVisible(this.commentField);
        this.commentField.sendKeys(protractor.Key.ENTER);
        return this;
    }

    checkCommentIsDisplayed(comment) {
        const row = element(by.cssContainingText('div[id="comment-message"]', comment));
        BrowserVisibility.waitUntilElementIsVisible(row);
        return this;
    }

    clickInvolvePeopleButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.involvePeopleButton);
        BrowserVisibility.waitUntilElementIsClickable(this.involvePeopleButton);
        browser.actions().mouseMove(this.involvePeopleButton).perform();
        this.involvePeopleButton.click();
        return this;
    }

    typeUser(user) {
        BrowserVisibility.waitUntilElementIsVisible(this.addPeopleField);
        this.addPeopleField.sendKeys(user);
        return this;
    }

    selectUserToInvolve(user) {
        this.getRowsUser(user).click();
        return this;
    }

    checkUserIsSelected(user) {
        const row = element(by.cssContainingText('div[class*="search-list-container"] div[class*="people-full-name"]', user));
        BrowserVisibility.waitUntilElementIsVisible(row);
        return this;
    }

    clickAddInvolvedUserButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.addInvolvedUserButton);
        BrowserVisibility.waitUntilElementIsClickable(this.addInvolvedUserButton);
        this.addInvolvedUserButton.click();
        return this;
    }

    getRowsUser(user) {
        const row = element(by.cssContainingText('div[class*="people-full-name"]', user));
        BrowserVisibility.waitUntilElementIsVisible(row);
        return row;
    }

    removeInvolvedUser(user) {
        const row = this.getRowsUser(user).element(by.xpath('ancestor::div[contains(@class, "adf-datatable-row")]'));
        BrowserVisibility.waitUntilElementIsVisible(row);
        row.element(by.css('button[data-automation-id="action_menu_0"]')).click();
        BrowserVisibility.waitUntilElementIsVisible(this.removeInvolvedPeople);
        return this.removeInvolvedPeople.click();
    }

    getInvolvedUserEmail(user) {
        const email = this.getRowsUser(user).element(this.emailInvolvedUser);
        BrowserVisibility.waitUntilElementIsVisible(email);
        return email.getText();
    }

    getInvolvedUserEditAction(user) {
        const edit = this.getRowsUser(user).element(this.editActionInvolvedUser);
        BrowserVisibility.waitUntilElementIsVisible(edit);
        return edit.getText();
    }

    clickAuditLogButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.auditLogButton);
        this.auditLogButton.click();
    }

    appSettingsToggles() {
        return this.appSettingsTogglesClass;
    }

    taskInfoDrawerIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskDetailsInfoDrawer);
    }

    taskInfoDrawerIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.taskDetailsInfoDrawer);
    }

    checkNoPeopleIsInvolved() {
        BrowserVisibility.waitUntilElementIsVisible(this.noPeopleInvolved);
        return this;
    }

    clickCancelInvolvePeopleButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.cancelInvolvePeopleButton);
        this.cancelInvolvePeopleButton.click();
        return this;
    }

    getInvolvePeopleHeader() {
        BrowserVisibility.waitUntilElementIsVisible(this.involvePeopleHeader);
        return this.involvePeopleHeader.getText();
    }

    getInvolvePeoplePlaceholder() {
        BrowserVisibility.waitUntilElementIsVisible(this.addPeopleField);
        return this.addPeopleField.getAttribute('placeholder');
    }

    checkCancelButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.cancelInvolvePeopleButton);
        BrowserVisibility.waitUntilElementIsClickable(this.cancelInvolvePeopleButton);
        return this;
    }

    checkAddPeopleButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.addInvolvedUserButton);
        BrowserVisibility.waitUntilElementIsClickable(this.addInvolvedUserButton);
        return this;
    }

    noUserIsDisplayedInSearchInvolvePeople(user) {
        BrowserVisibility.waitUntilElementIsNotOnPage(element(by.cssContainingText('div[class*="people-full-name"]', user)));
        return this;
    }

    getInvolvedPeopleTitle() {
        BrowserVisibility.waitUntilElementIsVisible(this.peopleTitle);
        return this.peopleTitle.getText();
    }

    getInvolvedPeopleInitialImage(user) {
        const pic = this.getRowsUser(user).element(this.involvedUserPic);
        BrowserVisibility.waitUntilElementIsVisible(pic);
        return pic.getText();
    }

    checkTaskDetails() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskDetailsSection);
        return this.taskDetailsSection.getText();
    }

    checkTaskDetailsEmpty() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskDetailsEmptySection);
        return this.taskDetailsEmptySection.getText();
    }

    checkTaskDetailsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskDetailsSection);
        BrowserVisibility.waitUntilElementIsVisible(this.formNameField);
        BrowserVisibility.waitUntilElementIsVisible(this.assigneeField);
        BrowserVisibility.waitUntilElementIsVisible(this.statusField);
        BrowserVisibility.waitUntilElementIsVisible(this.categoryField);
        BrowserVisibility.waitUntilElementIsVisible(this.parentNameField);
        BrowserVisibility.waitUntilElementIsVisible(this.createdField);
        BrowserVisibility.waitUntilElementIsVisible(this.idField);
        BrowserVisibility.waitUntilElementIsVisible(this.descriptionField);
        BrowserVisibility.waitUntilElementIsVisible(this.dueDateField);
        BrowserVisibility.waitUntilElementIsVisible(this.activitiesTitle);

        return this.taskDetailsSection.getText();
    }

    clickCompleteTask() {
        BrowserVisibility.waitUntilElementIsVisible(this.completeTask);
        return this.completeTask.click();
    }

    checkCompleteFormButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.completeFormTask);
        return this.completeFormTask;
    }

    checkCompleteTaskButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsClickable(this.completeTask);
        return this;
    }

    checkCompleteTaskButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.completeTask);
        return this;
    }

    clickCompleteFormTask() {
        BrowserVisibility.waitUntilElementIsClickable(this.completeFormTask);
        return this.completeFormTask.click();
    }

    getEmptyTaskDetailsMessage() {
        BrowserVisibility.waitUntilElementIsVisible(this.emptyTaskDetails);
        return this.emptyTaskDetails.getText();
    }

}
