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

var TestConfig = require('../../test.config');
var Util = require('../../util/util');
var ContentList = require('./dialog/contentList');

var TagPage = function () {

    var tagURL = TestConfig.adf.url + TestConfig.adf.port + "/tag";
    var addTagButton = element(by.css("button[id='add-tag']"));
    var insertNodeId = element(by.css("input[id='nodeId']"));
    var newTagInput = element(by.css("input[id='new-tag-text']"));
    var tagListRow = element(by.css("adf-tag-node-actions-list mat-list-item"));
    var tagListByNodeIdRow = element(by.css("adf-tag-node-list mat-chip"));
    var errorMessage = element(by.css("mat-hint[data-automation-id='errorMessage']"));
    var tagListRowLocator = by.css("adf-tag-node-actions-list mat-list-item div");
    var tagListByNodeIdRowLocator = by.css("adf-tag-node-list mat-chip span");
    var tagListContentServicesRowLocator = by.css("div[class*='adf-list-tag']");
    var showDeleteButton = element(by.id('adf-remove-button-tag'));
    var showMoreButton = element(by.css('button[data-automation-id="show-more-tags"]'));
    var showLessButton = element(by.css('button[data-automation-id="show-fewer-tags"]'));
    var tagsOnPage = element.all(by.css('div[class*="adf-list-tag"]'));

    this.getNodeId = function () {
        Util.waitUntilElementIsVisible(insertNodeId);
        return insertNodeId.getAttribute('value');
    };

    this.insertNodeId = function (nodeId) {
        Util.waitUntilElementIsVisible(insertNodeId);
        insertNodeId.clear();
        insertNodeId.sendKeys(nodeId);
        browser.driver.sleep(200);
        insertNodeId.sendKeys(' ')
        browser.driver.sleep(200);
        insertNodeId.sendKeys(protractor.Key.BACK_SPACE);
    };

    this.addNewTagInput = function (tag) {
        Util.waitUntilElementIsVisible(newTagInput);
        newTagInput.sendKeys(tag);
        return this;
    };

    this.addTag = function (tag) {
        this.addNewTagInput(tag);
        Util.waitUntilElementIsVisible(addTagButton);
        Util.waitUntilElementIsClickable(addTagButton);
        addTagButton.click();
        return this;
    };

    this.deleteTagFromTagListByNodeId = function (name) {
        var deleteChip = element(by.css('button[id="tag_chips_delete_' + name + '"]'));
        Util.waitUntilElementIsVisible(deleteChip);
        deleteChip.click();
        return this;
    };

    this.deleteTagFromTagList = function (name) {
        var deleteChip = element(by.xpath('//*[@id="tag_chips_delete_' + name + '"]/mat-icon'));
        Util.waitUntilElementIsVisible(deleteChip);
        deleteChip.click();
        return this;
    };

    this.getNewTagInput = function () {
        Util.waitUntilElementIsVisible(newTagInput);
        return newTagInput.getAttribute('value');
    };

    this.getNewTagPlaceholder = function () {
        Util.waitUntilElementIsVisible(newTagInput);
        return newTagInput.getAttribute("placeholder");
    };

    this.addTagButtonIsEnabled = function () {
        Util.waitUntilElementIsVisible(addTagButton);
        return addTagButton.isEnabled();
    };

    this.checkTagIsDisplayedInTagList = function (tagName) {
        var tag = element(by.cssContainingText("div[id*='tag_name']", tagName));
        return Util.waitUntilElementIsVisible(tag);
    };

    this.checkTagIsNotDisplayedInTagList = function (tagName) {
        var tag = element(by.cssContainingText("div[id*='tag_name']", tagName));
        return Util.waitUntilElementIsNotOnPage(tag);
    };

    this.checkTagIsNotDisplayedInTagListByNodeId = function (tagName) {
        var tag = element(by.cssContainingText("span[id*='tag_name']", tagName));
        return Util.waitUntilElementIsNotOnPage(tag);
    };

    this.checkTagIsDisplayedInTagListByNodeId = function (tagName) {
        var tag = element(by.cssContainingText("span[id*='tag_name']", tagName));
        return Util.waitUntilElementIsVisible(tag);
    };

    this.checkTagListIsEmpty = function () {
        Util.waitUntilElementIsNotOnPage(tagListRow);
    };

    this.checkTagListByNodeIdIsEmpty = function () {
        return Util.waitUntilElementIsNotOnPage(tagListByNodeIdRow);
    };

    this.checkTagIsDisplayedInTagListContentServices = function (tagName) {
        var tag = element(by.cssContainingText("div[class='adf-list-tag'][id*='tag_name']", tagName));
        return Util.waitUntilElementIsVisible(tag);
    };

    this.getErrorMessage = function () {
        Util.waitUntilElementIsPresent(errorMessage);
        return errorMessage.getText();
    };

    this.checkTagListIsOrderedAscending = function () {
        var deferred = protractor.promise.defer();
        new ContentList().checkListIsSorted(false, tagListRowLocator).then(function (result) {
            deferred.fulfill(result);
        });
        return deferred.promise;
    };

    this.checkTagListByNodeIdIsOrderedAscending = function () {
        var deferred = protractor.promise.defer();
        new ContentList().checkListIsSorted(false, tagListByNodeIdRowLocator).then(function (result) {
            deferred.fulfill(result);
        });
        return deferred.promise;
    };

    this.checkTagListContentServicesIsOrderedAscending = function () {
        var deferred = protractor.promise.defer();
        new ContentList().checkListIsSorted(false, tagListContentServicesRowLocator).then(function (result) {
            deferred.fulfill(result);
        });
        return deferred.promise;
    };

    this.checkDeleteTagFromTagListByNodeIdIsDisplayed = function (name) {
        var deleteChip = element(by.css('button[id="tag_chips_delete_' + name + '"]'));
        return Util.waitUntilElementIsVisible(deleteChip);
    };

    this.clickShowDeleteButtonSwitch = function () {
        Util.waitUntilElementIsVisible(showDeleteButton);
        Util.waitUntilElementIsClickable(showDeleteButton);
        showDeleteButton.click();
    };

    this.checkDeleteTagFromTagListByNodeIdIsNotDisplayed = function (name) {
        var deleteChip = element(by.css('button[id="tag_chips_delete_' + name + '"]'));
        return Util.waitUntilElementIsNotVisible(deleteChip);
    };

    this.checkShowMoreButtonIsDisplayed = function () {
        return Util.waitUntilElementIsVisible(showMoreButton);
    };

    this.checkShowMoreButtonIsNotDisplayed = function () {
        return Util.waitUntilElementIsNotVisible(showMoreButton);
    };

    this.clickShowMoreButton = function () {
        Util.waitUntilElementIsClickable(showMoreButton);
        return showMoreButton.click();
    };

    this.clickShowLessButton = function () {
        Util.waitUntilElementIsClickable(showLessButton);
        return showLessButton.click();
    };

    this.checkTagsOnList = function () {
        return tagsOnPage.count();
    };

    this.checkShowLessButtonIsDisplayed = function () {
        return Util.waitUntilElementIsVisible(showLessButton);
    };

    this.checkShowLessButtonIsNotDisplayed = function () {
        return Util.waitUntilElementIsNotVisible(showLessButton);
    };

    this.clickShowMoreButtonUntilNotDisplayed = function () {
        showMoreButton.isDisplayed().then((visible) => {
            if(visible){
                showMoreButton.click();

                this.clickShowMoreButtonUntilNotDisplayed();
            }
        }, err => {})
    };

    this.clickShowLessButtonUntilNotDisplayed = function () {
        showLessButton.isDisplayed().then((visible) => {
            if(visible){
                showLessButton.click();

                this.clickShowLessButtonUntilNotDisplayed();
            }
        }, err => {})
    };
};
module.exports = TagPage;
