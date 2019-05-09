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

import { element, by, protractor, browser } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class TagPage {

    addTagButton = element(by.css('button[id="add-tag"]'));
    insertNodeIdElement = element(by.css('input[id="nodeId"]'));
    newTagInput = element(by.css('input[id="new-tag-text"]'));
    tagListRow = element(by.css('adf-tag-node-actions-list mat-list-item'));
    tagListByNodeIdRow = element(by.css('adf-tag-node-list mat-chip'));
    errorMessage = element(by.css('mat-hint[data-automation-id="errorMessage"]'));
    tagListRowLocator = by.css('adf-tag-node-actions-list mat-list-item div');
    tagListByNodeIdRowLocator = by.css('adf-tag-node-list mat-chip span');
    tagListContentServicesRowLocator = by.css('div[class*="adf-list-tag"]');
    showDeleteButton = element(by.id('adf-remove-button-tag'));
    showMoreButton = element(by.css('button[data-automation-id="show-more-tags"]'));
    showLessButton = element(by.css('button[data-automation-id="show-fewer-tags"]'));
    tagsOnPage = element.all(by.css('div[class*="adf-list-tag"]'));
    confirmTag = element(by.id('adf-tag-node-send'));

    getNodeId() {
        BrowserVisibility.waitUntilElementIsVisible(this.insertNodeIdElement);
        return this.insertNodeIdElement.getAttribute('value');
    }

    insertNodeId(nodeId) {
        BrowserActions.clearSendKeys(this.insertNodeIdElement, nodeId);

        browser.driver.sleep(200);
        this.insertNodeIdElement.sendKeys(' ');
        browser.driver.sleep(200);
        this.insertNodeIdElement.sendKeys(protractor.Key.BACK_SPACE);
        this.clickConfirmTag();
    }

    addNewTagInput(tag) {
        BrowserVisibility.waitUntilElementIsVisible(this.newTagInput);
        BrowserActions.clearSendKeys(this.newTagInput, tag);
        return this;
    }

    addTag(tag) {
        this.addNewTagInput(tag);
        BrowserActions.click(this.addTagButton);
        return this;
    }

    deleteTagFromTagListByNodeId(name) {
        const deleteChip = element(by.id('tag_chips_delete_' + name));
        BrowserActions.click(deleteChip);
        return this;
    }

    deleteTagFromTagList(name) {
        const deleteChip = element(by.id('tag_chips_delete_' + name));
        BrowserActions.click(deleteChip);
        return this;
    }

    getNewTagInput() {
        BrowserVisibility.waitUntilElementIsVisible(this.newTagInput);
        return this.newTagInput.getAttribute('value');
    }

    getNewTagPlaceholder() {
        BrowserVisibility.waitUntilElementIsVisible(this.newTagInput);
        return this.newTagInput.getAttribute('placeholder');
    }

    addTagButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.addTagButton);
        return this.addTagButton.isEnabled();
    }

    checkTagIsDisplayedInTagList(tagName) {
        const tag = element(by.cssContainingText('div[id*="tag_name"]', tagName));
        return BrowserVisibility.waitUntilElementIsVisible(tag);
    }

    checkTagIsNotDisplayedInTagList(tagName) {
        const tag = element(by.cssContainingText('div[id*="tag_name"]', tagName));
        return BrowserVisibility.waitUntilElementIsNotOnPage(tag);
    }

    checkTagIsNotDisplayedInTagListByNodeId(tagName) {
        const tag = element(by.cssContainingText('span[id*="tag_name"]', tagName));
        return BrowserVisibility.waitUntilElementIsNotOnPage(tag);
    }

    checkTagIsDisplayedInTagListByNodeId(tagName) {
        const tag = element(by.cssContainingText('span[id*="tag_name"]', tagName));
        return BrowserVisibility.waitUntilElementIsVisible(tag);
    }

    checkTagListIsEmpty() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.tagListRow);
    }

    checkTagListByNodeIdIsEmpty() {
        return BrowserVisibility.waitUntilElementIsNotOnPage(this.tagListByNodeIdRow);
    }

    checkTagIsDisplayedInTagListContentServices(tagName) {
        const tag = element(by.cssContainingText('div[class="adf-list-tag"][id*="tag_name"]', tagName));
        return BrowserVisibility.waitUntilElementIsVisible(tag);
    }

    getErrorMessage() {
        return BrowserActions.getText(this.errorMessage);
    }

    checkTagListIsOrderedAscending() {
        const deferred = protractor.promise.defer();
        this.checkListIsSorted(false, this.tagListRowLocator).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    checkTagListByNodeIdIsOrderedAscending() {
        const deferred = protractor.promise.defer();
        this.checkListIsSorted(false, this.tagListByNodeIdRowLocator).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    checkTagListContentServicesIsOrderedAscending() {
        const deferred = protractor.promise.defer();
        this.checkListIsSorted(false, this.tagListContentServicesRowLocator).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    checkListIsSorted(sortOrder, locator) {
        const deferred = protractor.promise.defer();
        const tagList = element.all(locator);
        BrowserVisibility.waitUntilElementIsVisible(tagList.first());
        const initialList = [];
        tagList.each(function (currentElement) {
            currentElement.getText().then(function (text) {
                initialList.push(text);
            });
        }).then(function () {
            let sortedList = initialList;
            sortedList = sortedList.sort();
            if (sortOrder === false) {
                sortedList = sortedList.reverse();
            }
            deferred.fulfill(initialList.toString() === sortedList.toString());
        });
        return deferred.promise;
    }

    checkDeleteTagFromTagListByNodeIdIsDisplayed(name) {
        const deleteChip = element(by.id('tag_chips_delete_' + name));
        return BrowserVisibility.waitUntilElementIsVisible(deleteChip);
    }

    checkDeleteTagFromTagListByNodeIdIsNotDisplayed(name) {
        const deleteChip = element(by.id('tag_chips_delete_' + name));
        return BrowserVisibility.waitUntilElementIsNotVisible(deleteChip);
    }

    clickShowDeleteButtonSwitch() {
        BrowserActions.click(this.showDeleteButton);
    }

    checkShowMoreButtonIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.showMoreButton);
    }

    clickShowMoreButton() {
        return BrowserActions.click(this.showMoreButton);
    }

    clickConfirmTag() {
        return BrowserActions.click(this.confirmTag);
    }

    checkTagsOnList() {
        return this.tagsOnPage.count();
    }

    checkShowLessButtonIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.showLessButton);
    }

    checkShowLessButtonIsNotDisplayed() {
        return BrowserVisibility.waitUntilElementIsNotVisible(this.showLessButton);
    }

    clickShowMoreButtonUntilNotDisplayed() {
        this.showMoreButton.isDisplayed().then((visible) => {
            if (visible) {
                BrowserActions.click(this.showMoreButton);
                this.clickShowMoreButtonUntilNotDisplayed();
            }
        }, () => {
        });
    }

    clickShowLessButtonUntilNotDisplayed() {
        this.showLessButton.isDisplayed().then((visible) => {
            if (visible) {
                BrowserActions.click(this.showLessButton);
                this.clickShowLessButtonUntilNotDisplayed();
            }
        }, () => {
        });
    }
}
