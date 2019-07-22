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

import { element, by, protractor, browser, ElementFinder, ElementArrayFinder, promise } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class TagPage {

    addTagButton: ElementFinder = element(by.css('button[id="add-tag"]'));
    insertNodeIdElement: ElementFinder = element(by.css('input[id="nodeId"]'));
    newTagInput: ElementFinder = element(by.css('input[id="new-tag-text"]'));
    tagListRow: ElementFinder = element(by.css('adf-tag-node-actions-list mat-list-item'));
    tagListByNodeIdRow: ElementFinder = element(by.css('adf-tag-node-list mat-chip'));
    errorMessage: ElementFinder = element(by.css('mat-hint[data-automation-id="errorMessage"]'));
    tagListRowLocator = by.css('adf-tag-node-actions-list mat-list-item div');
    tagListByNodeIdRowLocator = by.css('adf-tag-node-list mat-chip span');
    tagListContentServicesRowLocator = by.css('div[class*="adf-list-tag"]');
    showDeleteButton: ElementFinder = element(by.id('adf-remove-button-tag'));
    showMoreButton: ElementFinder = element(by.css('button[data-automation-id="show-more-tags"]'));
    showLessButton: ElementFinder = element(by.css('button[data-automation-id="show-fewer-tags"]'));
    tagsOnPage: ElementArrayFinder = element.all(by.css('div[class*="adf-list-tag"]'));
    confirmTag: ElementFinder = element(by.id('adf-tag-node-send'));

    async getNodeId() {
        await BrowserVisibility.waitUntilElementIsVisible(this.insertNodeIdElement);
        return this.insertNodeIdElement.getAttribute('value');
    }

    async insertNodeId(nodeId) {
        await BrowserActions.clearSendKeys(this.insertNodeIdElement, nodeId);

        await  browser.driver.sleep(200);
        this.insertNodeIdElement.sendKeys(' ');
        await  browser.driver.sleep(200);
        this.insertNodeIdElement.sendKeys(protractor.Key.BACK_SPACE);
        this.clickConfirmTag();
    }

    async addNewTagInput(tag) {
        await BrowserVisibility.waitUntilElementIsVisible(this.newTagInput);
        await BrowserActions.clearSendKeys(this.newTagInput, tag);
    }

    async addTag(tag): Promise<void> {
        await this.addNewTagInput(tag);
        await BrowserActions.click(this.addTagButton);
    }

    async deleteTagFromTagListByNodeId(name): Promise<void> {
        const deleteChip: ElementFinder = element(by.id('tag_chips_delete_' + name));
        await BrowserActions.click(deleteChip);
    }

    async deleteTagFromTagList(name): Promise<void> {
        const deleteChip: ElementFinder = element(by.id('tag_chips_delete_' + name));
        await BrowserActions.click(deleteChip);
    }

    async getNewTagInput(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.newTagInput);
        return this.newTagInput.getAttribute('value');
    }

    async getNewTagPlaceholder(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.newTagInput);
        return this.newTagInput.getAttribute('placeholder');
    }

    async addTagButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.addTagButton);
        return this.addTagButton.isEnabled();
    }

    checkTagIsDisplayedInTagList(tagName): Promise<void> {
        const tag: ElementFinder = element(by.cssContainingText('div[id*="tag_name"]', tagName));
        return BrowserVisibility.waitUntilElementIsVisible(tag);
    }

    checkTagIsNotDisplayedInTagList(tagName): Promise<void> {
        const tag: ElementFinder = element(by.cssContainingText('div[id*="tag_name"]', tagName));
        return BrowserVisibility.waitUntilElementIsNotOnPage(tag);
    }

    checkTagIsNotDisplayedInTagListByNodeId(tagName): Promise<void> {
        const tag: ElementFinder = element(by.cssContainingText('span[id*="tag_name"]', tagName));
        return BrowserVisibility.waitUntilElementIsNotOnPage(tag);
    }

    checkTagIsDisplayedInTagListByNodeId(tagName): Promise<void> {
        const tag: ElementFinder = element(by.cssContainingText('span[id*="tag_name"]', tagName));
        return BrowserVisibility.waitUntilElementIsVisible(tag);
    }

    async checkTagListIsEmpty(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.tagListRow);
    }

    async checkTagListByNodeIdIsEmpty(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.tagListByNodeIdRow);
    }

    async checkTagIsDisplayedInTagListContentServices(tagName): Promise<void> {
        const tag: ElementFinder = element(by.cssContainingText('div[class="adf-list-tag"][id*="tag_name"]', tagName));
        await BrowserVisibility.waitUntilElementIsVisible(tag);
    }

    getErrorMessage(): Promise<string> {
        return BrowserActions.getText(this.errorMessage);
    }

    checkTagListIsOrderedAscending(): Promise<any> {
        return this.checkListIsSorted(false, this.tagListRowLocator);
    }

    checkTagListByNodeIdIsOrderedAscending(): Promise<any> {
        return this.checkListIsSorted(false, this.tagListByNodeIdRowLocator);
    }

    checkTagListContentServicesIsOrderedAscending(): Promise<any> {
        return this.checkListIsSorted(false, this.tagListContentServicesRowLocator);
    }

    async checkListIsSorted(sortOrder, locator): Promise<any> {
        const deferred = protractor.promise.defer();
        const tagList: ElementArrayFinder = element.all(locator);
        await BrowserVisibility.waitUntilElementIsVisible(tagList.first());
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

    async checkDeleteTagFromTagListByNodeIdIsDisplayed(name): Promise<void> {
        const deleteChip: ElementFinder = element(by.id('tag_chips_delete_' + name));
        await BrowserVisibility.waitUntilElementIsVisible(deleteChip);
    }

    async checkDeleteTagFromTagListByNodeIdIsNotDisplayed(name): Promise<void> {
        const deleteChip: ElementFinder = element(by.id('tag_chips_delete_' + name));
        await BrowserVisibility.waitUntilElementIsNotVisible(deleteChip);
    }

    async clickShowDeleteButtonSwitch(): Promise<void> {
        await BrowserActions.click(this.showDeleteButton);
    }

    async checkShowMoreButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.showMoreButton);
    }

    async clickShowMoreButton(): Promise<void> {
        await BrowserActions.click(this.showMoreButton);
    }

    async clickShowLessButton(): Promise<void> {
        await BrowserActions.click(this.showLessButton);
    }

    async clickConfirmTag(): Promise<void> {
        await BrowserActions.click(this.confirmTag);
    }

    checkTagsOnList(): promise.Promise<number> {
        return this.tagsOnPage.count();
    }

    async checkShowLessButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.showLessButton);
    }

    async checkShowLessButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.showLessButton);
    }

    async clickShowMoreButtonUntilNotDisplayed(): Promise<void> {
        const visible = await this.showMoreButton.isDisplayed();
        if (visible) {
            await BrowserActions.click(this.showMoreButton);
            await this.clickShowMoreButtonUntilNotDisplayed();
        }
    }

    async clickShowLessButtonUntilNotDisplayed(): Promise<void> {
        const visible = await this.showLessButton.isDisplayed();
        if (visible) {
            await BrowserActions.click(this.showLessButton);
            await this.clickShowLessButtonUntilNotDisplayed();
        }
    }
}
