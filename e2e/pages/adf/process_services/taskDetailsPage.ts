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

import { AppSettingsToggles } from './dialog/appSettingsToggles';
import { TabsPage } from '../material/tabsPage';
import { element, by, browser, protractor } from 'protractor';
import Util = require('../../../util/util');

export class TaskDetailsPage {
    formContent = element(by.css('adf-form'));
    formNameField = element(by.css('span[data-automation-id*="formName"] span'));
    assigneeField = element(by.css('span[data-automation-id*="assignee"] span'));
    statusField = element(by.css('span[data-automation-id*="status"] span'));
    categoryField = element(by.css('span[data-automation-id*="category"] span'));
    parentNameField = element(by.css('span[data-automation-id*="parentName"] span'));
    parentTaskIdField = element(by.css('span[data-automation-id*="parentTaskId"] span'));
    durationField = element(by.css('span[data-automation-id*="duration"] span'));
    endDateField = element(by.css('span[data-automation-id*="endDate"] span'));
    createdField = element(by.css('span[data-automation-id="card-dateitem-created"] span'));
    idField = element(by.css('span[data-automation-id*="id"] span'));
    descriptionField = element(by.css('span[data-automation-id*="description"] span'));
    dueDateField = element(by.css('span[data-automation-id*="dueDate"] span'));
    activitiesTitle = element(by.css('div[class*="adf-info-drawer-layout-header-title"] div'));
    commentField = element(by.id('comment-input'));
    addCommentButton = element(by.css('[data-automation-id="comments-input-add"]'));
    involvePeopleButton = element(by.css('div[class*="add-people"]'));
    addPeopleField = element(by.css('input[data-automation-id="adf-people-search-input"]'));
    addInvolvedUserButton = element(by.css('button[id="add-people"] span'));
    emailInvolvedUser = by.xpath('following-sibling::div[@class="people-email ng-star-inserted"]');
    editActionInvolvedUser = by.xpath('following-sibling::div[@class="people-edit-label ng-star-inserted"]');
    taskDetailsInfoDrawer = element(by.tagName('adf-info-drawer'));
    taskDetailsSection = element(by.css('div[data-automation-id="adf-tasks-details"]'));
    taskDetailsEmptySection = element(by.css('div[data-automation-id="adf-tasks-details--empty"]'));
    completeTask = element(by.css('button[id="adf-no-form-complete-button"]'));
    completeFormTask = element(by.css('button[id="adf-form-complete"]'));
    taskDetailsTitle = element(by.css('h2[class="activiti-task-details__header"] span'));
    auditLogButton = element(by.css('button[adf-task-audit]'));
    noPeopleInvolved = element(by.id('no-people-label'));
    cancelInvolvePeopleButton = element(by.id('close-people-search'));
    involvePeopleHeader = element(by.css('div[class="search-text-header"]'));
    removeInvolvedPeople = element(by.css('button[data-automation-id="Remove"]'));
    peopleTitle = element(by.id('people-title'));
    editFormButton = element.all(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-create"]')).last();
    attachFormDropdown = element(by.css('div[class="adf-attach-form-row"]'));
    cancelAttachForm = element(by.id('adf-no-form-cancel-button'));
    attachFormButton = element(by.id('adf-no-form-attach-form-button'));
    disabledAttachFormButton = element(by.css('button[id="adf-no-form-attach-form-button"][disabled]'));
    removeAttachForm = element(by.id('adf-no-form-remove-button'));
    attachFormName = element(by.css('span[class="adf-form-title ng-star-inserted"]'));

    getTaskDetailsTitle() {
        Util.waitUntilElementIsVisible(this.taskDetailsTitle);
        return this.taskDetailsTitle.getText();
    }

    checkSelectedForm(formName) {
        Util.waitUntilElementIsVisible(this.attachFormName);
        expect(formName).toEqual(this.attachFormName.getText());
    }

    checkAttachFormButtonIsDisabled() {
        Util.waitUntilElementIsVisible(this.disabledAttachFormButton);
    }

    checkAttachFormButtonIsEnabled() {
        Util.waitUntilElementIsClickable(this.attachFormButton);
    }

    checkEditFormButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.editFormButton);
    }

    clickEditFormButton() {
        Util.waitUntilElementIsClickable(this.editFormButton);
        return this.editFormButton.click();
    }

    checkAttachFormDropdownIsDisplayed() {
        Util.waitUntilElementIsVisible(this.attachFormDropdown);
    }

    clickAttachFormDropdown() {
        Util.waitUntilElementIsClickable(this.attachFormDropdown);
        return this.attachFormDropdown.click();
    }

    selectAttachFormOption(option) {
        let selectedOption = element(by.cssContainingText('mat-option[role="option"]', option));
        Util.waitUntilElementIsClickable(selectedOption);
        return selectedOption.click();
    }

    checkCancelAttachFormIsDisplayed() {
        Util.waitUntilElementIsVisible(this.cancelAttachForm);
    }

    noFormIsDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.formContent);
        return this;
    }

    clickCancelAttachForm() {
        Util.waitUntilElementIsClickable(this.cancelAttachForm);
        return this.cancelAttachForm.click();
    }

    checkRemoveAttachFormIsDisplayed() {
        Util.waitUntilElementIsVisible(this.removeAttachForm);
    }

    clickRemoveAttachForm() {
        Util.waitUntilElementIsClickable(this.removeAttachForm);
        return this.removeAttachForm.click();
    }

    checkAttachFormButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.attachFormButton);
    }

    checkAttachFormButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.attachFormButton);
    }

    clickAttachFormButton() {
        Util.waitUntilElementIsClickable(this.attachFormButton);
        return this.attachFormButton.click();
    }

    checkFormIsAttached(formName) {
        Util.waitUntilElementIsVisible(this.formNameField);
        this.formNameField.getText().then((attachedFormName) => {
            expect(attachedFormName).toEqual(formName);
        });
    }

    getFormName() {
        Util.waitUntilElementIsVisible(this.formNameField);
        return this.formNameField.getText();
    }

    getAssignee() {
        Util.waitUntilElementIsVisible(this.assigneeField);
        return this.assigneeField.getText();
    }

    getStatus() {
        Util.waitUntilElementIsVisible(this.statusField);
        return this.statusField.getText();
    }

    getCategory() {
        Util.waitUntilElementIsVisible(this.categoryField);
        return this.categoryField.getText();
    }

    getParentName() {
        Util.waitUntilElementIsVisible(this.parentNameField);
        return this.parentNameField.getText();
    }

    getParentTaskId() {
        Util.waitUntilElementIsVisible(this.parentTaskIdField);
        return this.parentTaskIdField.getText();
    }

    getDuration() {
        Util.waitUntilElementIsVisible(this.durationField);
        return this.durationField.getText();
    }

    getEndDate() {
        Util.waitUntilElementIsVisible(this.endDateField);
        return this.endDateField.getText();
    }

    getCreated() {
        Util.waitUntilElementIsVisible(this.createdField);
        return this.createdField.getText();
    }

    getId() {
        Util.waitUntilElementIsVisible(this.idField);
        return this.idField.getText();
    }

    getDescription() {
        Util.waitUntilElementIsVisible(this.descriptionField);
        return this.descriptionField.getText();
    }

    getDueDate() {
        Util.waitUntilElementIsVisible(this.dueDateField);
        return this.dueDateField.getText();
    }

    getTitle() {
        Util.waitUntilElementIsVisible(this.activitiesTitle);
        return this.activitiesTitle.getText();
    }

    selectActivityTab() {
        let tabsPage = new TabsPage;
        tabsPage.clickTabByTitle('Activity');
        return this;
    }

    selectDetailsTab() {
        let tabsPage = new TabsPage;
        tabsPage.clickTabByTitle('Details');
        return this;
    }

    addComment(comment) {
        Util.waitUntilElementIsVisible(this.commentField);
        this.commentField.sendKeys(comment);
        this.addCommentButton.click();
        return this;
    }

    clearComment(comment) {
        Util.waitUntilElementIsVisible(this.commentField);
        this.commentField.sendKeys(protractor.Key.ENTER);
        return this;
    }

    checkCommentIsDisplayed(comment) {
        let row = element(by.cssContainingText('div[id="comment-message"]', comment));
        Util.waitUntilElementIsVisible(row);
        return this;
    }

    clickInvolvePeopleButton() {
        Util.waitUntilElementIsVisible(this.involvePeopleButton);
        Util.waitUntilElementIsClickable(this.involvePeopleButton);
        browser.actions().mouseMove(this.involvePeopleButton).perform();
        this.involvePeopleButton.click();
        return this;
    }

    typeUser(user) {
        Util.waitUntilElementIsVisible(this.addPeopleField);
        this.addPeopleField.sendKeys(user);
        return this;
    }

    selectUserToInvolve(user) {
        this.getRowsUser(user).click();
        return this;
    }

    checkUserIsSelected(user) {
        let row = element(by.cssContainingText('div[class*="search-list-container"] div[class*="people-full-name"]', user));
        Util.waitUntilElementIsVisible(row);
        return this;
    }

    clickAddInvolvedUserButton() {
        Util.waitUntilElementIsVisible(this.addInvolvedUserButton);
        Util.waitUntilElementIsClickable(this.addInvolvedUserButton);
        this.addInvolvedUserButton.click();
        return this;
    }

    getRowsUser(user) {
        let row = element(by.cssContainingText('div[class*="people-full-name"]', user));
        Util.waitUntilElementIsVisible(row);
        return row;
    }

    removeInvolvedUser(user) {
        let row = this.getRowsUser(user).element(by.xpath('ancestor::div[contains(@class, "adf-datatable-row")]'));
        Util.waitUntilElementIsVisible(row);
        row.element(by.css('button[data-automation-id="action_menu_0"]')).click();
        Util.waitUntilElementIsVisible(this.removeInvolvedPeople);
        return this.removeInvolvedPeople.click();
    }

    getInvolvedUserEmail(user) {
        let email = this.getRowsUser(user).element(this.emailInvolvedUser);
        Util.waitUntilElementIsVisible(email);
        return email.getText();
    }

    getInvolvedUserEditAction(user) {
        let edit = this.getRowsUser(user).element(this.editActionInvolvedUser);
        Util.waitUntilElementIsVisible(edit);
        return edit.getText();
    }

    clickAuditLogButton() {
        Util.waitUntilElementIsVisible(this.auditLogButton);
        this.auditLogButton.click();
    }

    appSettingsToggles() {
        return new AppSettingsToggles();
    }

    taskInfoDrawerIsDisplayed() {
        Util.waitUntilElementIsVisible(this.taskDetailsInfoDrawer);
    }

    taskInfoDrawerIsNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.taskDetailsInfoDrawer);
    }

    checkNoPeopleIsInvolved() {
        Util.waitUntilElementIsVisible(this.noPeopleInvolved);
        return this;
    }

    clickCancelInvolvePeopleButton() {
        Util.waitUntilElementIsVisible(this.cancelInvolvePeopleButton);
        this.cancelInvolvePeopleButton.click();
        return this;
    }

    getInvolvePeopleHeader() {
        Util.waitUntilElementIsVisible(this.involvePeopleHeader);
        return this.involvePeopleHeader.getText();
    }

    getInvolvePeoplePlaceholder() {
        Util.waitUntilElementIsVisible(this.addPeopleField);
        return this.addPeopleField.getAttribute('placeholder');
    }

    checkCancelButtonIsEnabled() {
        Util.waitUntilElementIsVisible(this.cancelInvolvePeopleButton);
        Util.waitUntilElementIsClickable(this.cancelInvolvePeopleButton);
        return this;
    }

    checkAddPeopleButtonIsEnabled() {
        Util.waitUntilElementIsVisible(this.addInvolvedUserButton);
        Util.waitUntilElementIsClickable(this.addInvolvedUserButton);
        return this;
    }

    noUserIsDisplayedInSearchInvolvePeople(user) {
        Util.waitUntilElementIsNotOnPage(element(by.cssContainingText('div[class*="people-full-name"]', user)));
        return this;
    }

    getInvolvedPeopleTitle() {
        Util.waitUntilElementIsVisible(this.peopleTitle);
        return this.peopleTitle.getText();
    }

    checkTaskDetails() {
        Util.waitUntilElementIsVisible(this.taskDetailsSection);
        return this.taskDetailsSection.getText();
    }

    checkTaskDetailsEmpty() {
        Util.waitUntilElementIsVisible(this.taskDetailsEmptySection);
        return this.taskDetailsEmptySection.getText();
    }

    checkTaskDetailsDisplayed() {
        Util.waitUntilElementIsVisible(this.taskDetailsSection);
        Util.waitUntilElementIsVisible(this.formNameField);
        Util.waitUntilElementIsVisible(this.assigneeField);
        Util.waitUntilElementIsVisible(this.statusField);
        Util.waitUntilElementIsVisible(this.categoryField);
        Util.waitUntilElementIsVisible(this.parentNameField);
        Util.waitUntilElementIsVisible(this.createdField);
        Util.waitUntilElementIsVisible(this.idField);
        Util.waitUntilElementIsVisible(this.descriptionField);
        Util.waitUntilElementIsVisible(this.dueDateField);
        Util.waitUntilElementIsVisible(this.activitiesTitle);

        return this.taskDetailsSection.getText();
    }

    clickCompleteTask() {
        Util.waitUntilElementIsVisible(this.completeTask);
        return this.completeTask.click();
    }

    checkCompleteFormButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.completeFormTask);
        return this.completeFormTask;
    }

    checkCompleteTaskButtonIsEnabled() {
        Util.waitUntilElementIsClickable(this.completeTask);
        return this;
    }

    checkCompleteTaskButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.completeTask);
        return this;
    }

    clickCompleteFormTask() {
        Util.waitUntilElementIsClickable(this.completeFormTask);
        return this.completeFormTask.click();
    }

}
