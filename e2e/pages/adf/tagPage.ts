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

import { element, by, protractor, browser, ElementFinder, ElementArrayFinder } from 'protractor';
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

    async getNodeId(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.insertNodeIdElement);
        return await this.insertNodeIdElement.getAttribute('value');
    }

    async insertNodeId(nodeId) {
        await BrowserActions.clearSendKeys(this.insertNodeIdElement, nodeId);

        await browser.sleep(200);
        await this.insertNodeIdElement.sendKeys(' ');
        await browser.sleep(200);
        await this.insertNodeIdElement.sendKeys(protractor.Key.BACK_SPACE);
        await this.clickConfirmTag();
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
        return await this.newTagInput.getAttribute('value');
    }

    async getNewTagPlaceholder(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.newTagInput);
        return await this.newTagInput.getAttribute('placeholder');
    }

    async addTagButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.addTagButton);
        return await this.addTagButton.isEnabled();
    }

    async checkTagIsDisplayedInTagList(tagName): Promise<void> {
        const tag: ElementFinder = element(by.cssContainingText('div[id*="tag_name"]', tagName));
        await BrowserVisibility.waitUntilElementIsVisible(tag);
    }

    async checkTagIsNotDisplayedInTagList(tagName): Promise<void> {
        const tag: ElementFinder = element(by.cssContainingText('div[id*="tag_name"]', tagName));
        await BrowserVisibility.waitUntilElementIsNotVisible(tag);
    }

    async checkTagIsNotDisplayedInTagListByNodeId(tagName): Promise<void> {
        const tag: ElementFinder = element(by.cssContainingText('span[id*="tag_name"]', tagName));
        await BrowserVisibility.waitUntilElementIsNotVisible(tag);
    }

    async checkTagIsDisplayedInTagListByNodeId(tagName): Promise<void> {
        const tag: ElementFinder = element(by.cssContainingText('span[id*="tag_name"]', tagName));
        await BrowserVisibility.waitUntilElementIsVisible(tag);
    }

    async checkTagListIsEmpty(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.tagListRow);
    }

    async checkTagListByNodeIdIsEmpty(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.tagListByNodeIdRow);
    }

    async checkTagIsDisplayedInTagListContentServices(tagName): Promise<void> {
        const tag: ElementFinder = element(by.cssContainingText('div[class="adf-list-tag"][id*="tag_name"]', tagName));
        await BrowserVisibility.waitUntilElementIsVisible(tag);
    }

    async getErrorMessage(): Promise<string> {
        return await BrowserActions.getText(this.errorMessage);
    }

    async checkTagListIsOrderedAscending(): Promise<any> {
        await this.checkListIsSorted(false, this.tagListRowLocator);
    }

    async checkTagListByNodeIdIsOrderedAscending(): Promise<any> {
        await this.checkListIsSorted(false, this.tagListByNodeIdRowLocator);
    }

    async checkTagListContentServicesIsOrderedAscending(): Promise<any> {
        await this.checkListIsSorted(false, this.tagListContentServicesRowLocator);
    }

    async checkListIsSorted(sortOrder, locator): Promise<boolean> {
        const tagList: ElementArrayFinder = element.all(locator);
        await BrowserVisibility.waitUntilElementIsVisible(tagList.first());
        const initialList = [];
        await tagList.each(async (currentElement) => {
            const text = await BrowserActions.getText(currentElement);
            initialList.push(text);
        });
        let sortedList = initialList;
        sortedList = sortedList.sort();
        if (sortOrder === false) {
            sortedList = sortedList.reverse();
        }
        return initialList.toString() === sortedList.toString();
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

    async checkTagsOnList(): Promise<number> {
        return await this.tagsOnPage.count();
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
