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

import { Util } from '../../util/util';
import { DocumentListPage } from './content-services/documentListPage';

import { element, by, protractor, browser } from 'protractor';

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

    getNodeId() {
        Util.waitUntilElementIsVisible(this.insertNodeIdElement);
        return this.insertNodeIdElement.getAttribute('value');
    }

    insertNodeId(nodeId) {
        Util.waitUntilElementIsVisible(this.insertNodeIdElement);
        this.insertNodeIdElement.clear();
        this.insertNodeIdElement.sendKeys(nodeId);
        browser.driver.sleep(200);
        this.insertNodeIdElement.sendKeys(' ');
        browser.driver.sleep(200);
        this.insertNodeIdElement.sendKeys(protractor.Key.BACK_SPACE);
    }

    addNewTagInput(tag) {
        Util.waitUntilElementIsVisible(this.newTagInput);
        this.newTagInput.sendKeys(tag);
        return this;
    }

    addTag(tag) {
        this.addNewTagInput(tag);
        Util.waitUntilElementIsVisible(this.addTagButton);
        Util.waitUntilElementIsClickable(this.addTagButton);
        this.addTagButton.click();
        return this;
    }

    deleteTagFromTagListByNodeId(name) {
        let deleteChip = element(by.id('tag_chips_delete_' + name));
        Util.waitUntilElementIsVisible(deleteChip);
        deleteChip.click();
        return this;
    }

    deleteTagFromTagList(name) {
        let deleteChip = element(by.id('tag_chips_delete_' + name));
        Util.waitUntilElementIsVisible(deleteChip);
        deleteChip.click();
        return this;
    }

    getNewTagInput() {
        Util.waitUntilElementIsVisible(this.newTagInput);
        return this.newTagInput.getAttribute('value');
    }

    getNewTagPlaceholder() {
        Util.waitUntilElementIsVisible(this.newTagInput);
        return this.newTagInput.getAttribute('placeholder');
    }

    addTagButtonIsEnabled() {
        Util.waitUntilElementIsVisible(this.addTagButton);
        return this.addTagButton.isEnabled();
    }

    checkTagIsDisplayedInTagList(tagName) {
        let tag = element(by.cssContainingText('div[id*="tag_name"]', tagName));
        return Util.waitUntilElementIsVisible(tag);
    }

    checkTagIsNotDisplayedInTagList(tagName) {
        let tag = element(by.cssContainingText('div[id*="tag_name"]', tagName));
        return Util.waitUntilElementIsNotOnPage(tag);
    }

    checkTagIsNotDisplayedInTagListByNodeId(tagName) {
        let tag = element(by.cssContainingText('span[id*="tag_name"]', tagName));
        return Util.waitUntilElementIsNotOnPage(tag);
    }

    checkTagIsDisplayedInTagListByNodeId(tagName) {
        let tag = element(by.cssContainingText('span[id*="tag_name"]', tagName));
        return Util.waitUntilElementIsVisible(tag);
    }

    checkTagListIsEmpty() {
        Util.waitUntilElementIsNotOnPage(this.tagListRow);
    }

    checkTagListByNodeIdIsEmpty() {
        return Util.waitUntilElementIsNotOnPage(this.tagListByNodeIdRow);
    }

    checkTagIsDisplayedInTagListContentServices(tagName) {
        let tag = element(by.cssContainingText('div[class="adf-list-tag"][id*="tag_name"]', tagName));
        return Util.waitUntilElementIsVisible(tag);
    }

    getErrorMessage() {
        Util.waitUntilElementIsPresent(this.errorMessage);
        return this.errorMessage.getText();
    }

    checkTagListIsOrderedAscending() {
        let deferred = protractor.promise.defer();
        new DocumentListPage().checkListIsSorted(false, this.tagListRowLocator).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    checkTagListByNodeIdIsOrderedAscending() {
        let deferred = protractor.promise.defer();
        new DocumentListPage().checkListIsSorted(false, this.tagListByNodeIdRowLocator).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    checkTagListContentServicesIsOrderedAscending() {
        let deferred = protractor.promise.defer();
        new DocumentListPage().checkListIsSorted(false, this.tagListContentServicesRowLocator).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    checkDeleteTagFromTagListByNodeIdIsDisplayed(name) {
        let deleteChip = element(by.id('tag_chips_delete_' + name));
        return Util.waitUntilElementIsVisible(deleteChip);
    }

    checkDeleteTagFromTagListByNodeIdIsNotDisplayed(name) {
        let deleteChip = element(by.id('tag_chips_delete_' + name));
        return Util.waitUntilElementIsNotVisible(deleteChip);
    }

    clickShowDeleteButtonSwitch() {
        Util.waitUntilElementIsVisible(this.showDeleteButton);
        Util.waitUntilElementIsClickable(this.showDeleteButton);
        this.showDeleteButton.click();
    }

    checkShowMoreButtonIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.showMoreButton);
    }

    clickShowMoreButton() {
        Util.waitUntilElementIsClickable(this.showMoreButton);
        return this.showMoreButton.click();
    }

    checkTagsOnList() {
        return this.tagsOnPage.count();
    }

    checkShowLessButtonIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.showLessButton);
    }

    checkShowLessButtonIsNotDisplayed() {
        return Util.waitUntilElementIsNotVisible(this.showLessButton);
    }

    clickShowMoreButtonUntilNotDisplayed() {
        this.showMoreButton.isDisplayed().then((visible) => {
            if (visible) {
                this.showMoreButton.click();
                this.clickShowMoreButtonUntilNotDisplayed();
            }
        }, (err) => {
        });
    }

    clickShowLessButtonUntilNotDisplayed() {
        this.showLessButton.isDisplayed().then((visible) => {
            if (visible) {
                this.showLessButton.click();

                this.clickShowLessButtonUntilNotDisplayed();
            }
        }, (err) => {
        });
    }
}
