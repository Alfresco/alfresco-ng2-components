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

var Util = require('../../../util/util');
var TaskDetailsToggles = require('./dialog/taskDetailsToggles');

var TaskDetailsPage = function () {

    var formNameField = element(by.css("span[data-automation-id*='formName'] span"));
    var assigneeField = element(by.css("span[data-automation-id*='assignee'] span"));
    var statusField = element(by.css("span[data-automation-id*='status'] span"));
    var categoryField = element(by.css("span[data-automation-id*='category'] span"));
    var parentNameField = element(by.css("span[data-automation-id*='parentName'] span"));
    var createdField = element(by.css("span[data-automation-id='card-dateitem-created'] span"));
    var idField = element(by.css("span[data-automation-id*='id'] span"));
    var descriptionField = element(by.css("span[data-automation-id*='description'] span"));
    var dueDateField = element(by.css("span[data-automation-id*='dueDate'] span"));
    var activitiesTitle = element(by.css("div[class*='adf-info-drawer-layout-header-title'] div"));
    var commentField = element(by.id("comment-input"));
    var addCommentButton = element(by.css("[data-automation-id='comments-input-add']"));
    var activityTab = element(by.cssContainingText("div[class*='mat-tab-label ']", "Activity"));
    var detailsTab = element(by.cssContainingText("div[class*='mat-tab-label ']", "Details"));
    var involvePeopleButton = element(by.css("div[class*='add-people']"));
    var addPeopleField = element(by.css("input[data-automation-id='adf-people-search-input']"));
    var addInvolvedUserButton = element(by.css("button[id='add-people'] span"));
    var emailInvolvedUser = by.xpath("following-sibling::div[@class='people-email ng-star-inserted']");
    var editActionInvolvedUser = by.xpath("following-sibling::div[@class='people-edit-label ng-star-inserted']");
    var involvedUserPic = by.xpath("ancestor::div/ancestor::div/preceding-sibling::div//div[@class='adf-people-search-people-pic ng-star-inserted']");
    var infoDrawer = element(by.css("adf-info-drawer"));
    var taskDetailsSection = element(by.css("div[data-automation-id='adf-tasks-details']"));
    var taskDetailsEmptySection = element(by.css("div[data-automation-id='adf-tasks-details--empty']"));
    var completeTask = element(by.css("button[id='adf-no-form-complete-button']"));
    var auditLogButton = element(by.css("button[adf-task-audit]"));

    var noPeopleInvolved = element(by.id('no-people-label'));
    var cancelInvolvePeopleButton = element(by.id('close-people-search'));
    var involvePeopleHeader = element(by.css("div[class='search-text-header']"));
    var removeInvolvedPeople = element(by.css("button[data-automation-id='Remove']"));
    var peopleTitle = element(by.id("people-title"));
    var taskDetailsSection = element(by.css('div[class="adf-task-details ng-star-inserted"]'));
    var taskDetailsEmptySection = element(by.css('div[class="full-width adf-data-table ng-star-inserted adf-data-table--empty"]'));
    var completeTask = element(by.css('button[id="adf-no-form-complete-button"]'));
    var taskDetailsTitle = element(by.css('h2[class="activiti-task-details__header"] span'));

    this.getTaskDetailsTitle = function () {
        Util.waitUntilElementIsVisible(taskDetailsTitle);
        return taskDetailsTitle.getText();
    };

    this.getFormName = function () {
        Util.waitUntilElementIsVisible(formNameField);
        return formNameField.getText();
    };

    this.getAssignee = function () {
        Util.waitUntilElementIsVisible(assigneeField);
        return assigneeField.getText();
    };

    this.getStatus = function () {
        Util.waitUntilElementIsVisible(statusField);
        return statusField.getText();
    };

    this.getCategory = function () {
        Util.waitUntilElementIsVisible(categoryField);
        return categoryField.getText();
    };

    this.getParentName = function () {
        Util.waitUntilElementIsVisible(parentNameField);
        return parentNameField.getText();
    };

    this.getCreated = function () {
        Util.waitUntilElementIsVisible(createdField);
        return createdField.getText();
    };

    this.getId = function () {
        Util.waitUntilElementIsVisible(idField);
        return idField.getText();
    };

    this.getDescription = function () {
        Util.waitUntilElementIsVisible(descriptionField);
        return descriptionField.getText();
    };

    this.getDueDate = function () {
        Util.waitUntilElementIsVisible(dueDateField);
        return dueDateField.getText();
    };

    this.getTitle = function () {
        Util.waitUntilElementIsVisible(activitiesTitle);
        return activitiesTitle.getText();
    };

    this.selectActivityTab = function () {
        Util.waitUntilElementIsVisible(activityTab);
        activityTab.getAttribute('aria-selected').then(function (check) {
            if (check === 'false') {
                activityTab.click();
                expect(activityTab.getAttribute('aria-selected')==="true");
            }
        });
        return this;
    };

    this.selectDetailsTab = function () {
        Util.waitUntilElementIsVisible(detailsTab);
        detailsTab.getAttribute('aria-selected').then(function (check) {
            if (check === 'false') {
                detailsTab.click();
                expect(detailsTab.getAttribute('aria-selected')==="true");
            }
        });
        return this;
    };

    this.addComment = function (comment) {
        Util.waitUntilElementIsVisible(commentField);
        commentField.sendKeys(comment);
        addCommentButton.click();
        return this;
    };

    this.clearComment = function (comment) {
        Util.waitUntilElementIsVisible(commentField);
        commentField.sendKeys(protractor.Key.ENTER);
        return this;
    };

    this.checkCommentIsDisplayed = function (comment) {
        var row = element(by.cssContainingText("div[id='comment-message']", comment));
        Util.waitUntilElementIsVisible(row);
        return this;
    };

    this.clickInvolvePeopleButton = function () {
        Util.waitUntilElementIsVisible(involvePeopleButton);
        Util.waitUntilElementIsClickable(involvePeopleButton);
        browser.actions().mouseMove(involvePeopleButton).perform();
        involvePeopleButton.click();
        return this;
    };

    this.typeUser = function (user) {
        Util.waitUntilElementIsVisible(addPeopleField);
        addPeopleField.sendKeys(user);
        return this;
    };

    this.selectUserToInvolve = function(user) {
        this.getRowsUser(user).click();
        return this;
    };

    this.checkUserIsSelected = function(user) {
        var row = element(by.cssContainingText("div[class*='search-list-container'] div[class*='people-full-name']", user));
        var selectedRow = this.getRowsUser(user).element(by.css("ancestor::tr[class*='is-selected']"));
        Util.waitUntilElementIsVisible(row);
        return this;
    };

    this.clickAddInvolvedUserButton = function () {
        Util.waitUntilElementIsVisible(addInvolvedUserButton);
        Util.waitUntilElementIsClickable(addInvolvedUserButton);
        addInvolvedUserButton.click();
        return this;
    }

    this.getRowsUser = function (user) {
        var row = element(by.cssContainingText("div[class*='people-full-name']", user));
        Util.waitUntilElementIsVisible(row);
        return row;
    };

    this.removeInvolvedUser = function (user) {
        var row = this.getRowsUser(user).element(by.xpath("ancestor::div[contains(@class, 'adf-datatable-row')]"));
        Util.waitUntilElementIsVisible(row);
        row.element(by.css("button[data-automation-id='action_menu_0']")).click();
        Util.waitUntilElementIsVisible(removeInvolvedPeople);
        return removeInvolvedPeople.click();
    };

    this.getInvolvedUserEmail = function (user) {
        var email = this.getRowsUser(user).element(emailInvolvedUser);
        Util.waitUntilElementIsVisible(email);
        return email.getText();
    };

    this.getInvolvedUserEditAction = function (user) {
        var edit = this.getRowsUser(user).element(editActionInvolvedUser);
        Util.waitUntilElementIsVisible(edit);
        return edit.getText();
    };

    this.clickAuditLogButton = function () {
        Util.waitUntilElementIsVisible(auditLogButton);
        auditLogButton.click();
    };

    this.usingTaskDetailsToggles = function () {
        return new TaskDetailsToggles();
    };

    this.taskInfoDrawerIsDisplayed = function () {
        Util.waitUntilElementIsVisible(infoDrawer);
    };

    this.taskInfoDrawerIsNotDisplayed = function () {
        Util.waitUntilElementIsNotOnPage(infoDrawer);
    };

    this.checkNoPeopleIsInvolved = function () {
        Util.waitUntilElementIsVisible(noPeopleInvolved);
        return this;
    };

    this.clickCancelInvolvePeopleButton = function () {
        Util.waitUntilElementIsVisible(cancelInvolvePeopleButton);
        cancelInvolvePeopleButton.click();
        return this;
    };

    this.getInvolvePeopleHeader = function () {
        Util.waitUntilElementIsVisible(involvePeopleHeader);
        return involvePeopleHeader.getText();
    };

    this.getInvolvePeoplePlaceholder = function () {
        Util.waitUntilElementIsVisible(addPeopleField);
        return addPeopleField.getAttribute('placeholder');
    };

    this.checkCancelButtonIsEnabled = function () {
        Util.waitUntilElementIsVisible(cancelInvolvePeopleButton);
        Util.waitUntilElementIsClickable(cancelInvolvePeopleButton);
        return this;
    };

    this.checkAddPeopleButtonIsEnabled = function () {
        Util.waitUntilElementIsVisible(addInvolvedUserButton);
        Util.waitUntilElementIsClickable(addInvolvedUserButton);
        return this;
    };

    this.noUserIsDisplayedInSearchInvolvePeople = function (user) {
        Util.waitUntilElementIsNotOnPage(element(by.cssContainingText("div[class*='people-full-name']", user)));
        return this;
    };

    this.getInvolvedPeopleTitle = function () {
        Util.waitUntilElementIsVisible(peopleTitle);
        return peopleTitle.getText();
    };

    this.getInvolvedPeopleInitialImage = function (user) {
        var pic = this.getRowsUser(user).element(involvedUserPic);
        Util.waitUntilElementIsVisible(pic);
        return pic.getText();
    }
    
    this.checkTaskDetails = function () {
        Util.waitUntilElementIsVisible(taskDetailsSection);
        return taskDetailsSection.getText();
    };

    this.checkTaskDetailsEmpty = function () {
        Util.waitUntilElementIsVisible(taskDetailsEmptySection);
        return taskDetailsEmptySection.getText();
    };

    this.checkTaskDetailsDisplayed = function () {
        Util.waitUntilElementIsVisible(taskDetailsSection);
        Util.waitUntilElementIsVisible(formNameField);
        Util.waitUntilElementIsVisible(assigneeField);
        Util.waitUntilElementIsVisible(statusField);
        Util.waitUntilElementIsVisible(categoryField);
        Util.waitUntilElementIsVisible(parentNameField);
        Util.waitUntilElementIsVisible(createdField);
        Util.waitUntilElementIsVisible(idField);
        Util.waitUntilElementIsVisible(descriptionField);
        Util.waitUntilElementIsVisible(dueDateField);
        Util.waitUntilElementIsVisible(dueDateField);
        Util.waitUntilElementIsVisible(activitiesTitle);

        return taskDetailsSection.getText();
    };

    this.clickCompleteTask = function () {
        Util.waitUntilElementIsVisible(completeTask);
        return completeTask.click();
    };

};

module.exports = TaskDetailsPage;
