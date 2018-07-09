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
    var commentField = element(by.css("input[id='comment-input']"));
    var activityTab = element(by.cssContainingText("div[class*='mat-tab-label ']", "Activity"));
    var detailsTab = element(by.cssContainingText("div[class*='mat-tab-label ']", "Details"));
    var involvePeopleButton = element(by.css("div[class*='add-people']"));
    var addPeopleField = element(by.css("input[data-automation-id='adf-people-search-input']"));
    var addInvolvedUserButton = element(by.css("button[id='add-people'] span"));
    var emailInvolvedUser = by.xpath("following-sibling::div[@class='people-email ng-star-inserted']");

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

    this.getInvolvedUserEmail = function (user) {
        var email = this.getRowsUser(user).element(emailInvolvedUser);
        Util.waitUntilElementIsVisible(email);
        return email.getText();
    };

};

module.exports = TaskDetailsPage;
