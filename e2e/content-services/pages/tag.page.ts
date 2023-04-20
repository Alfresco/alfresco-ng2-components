/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { by, protractor, browser, $, $$ } from 'protractor';
import { BrowserActions, TestElement } from '@alfresco/adf-testing';

export class TagPage {

    addTagButton = TestElement.byCss('#add-tag');
    insertNodeIdElement = $('input[id="nodeId"]');
    newTagInput = TestElement.byCss('input[id="new-tag-text"]');
    tagListRow = TestElement.byCss('adf-tag-node-actions-list mat-list-item');
    tagListByNodeIdRow = TestElement.byCss('adf-tag-node-list mat-chip');
    errorMessage = TestElement.byCss('mat-hint[data-automation-id="errorMessage"]');
    tagListContentServicesRowLocator = by.css('div[class*="adf-list-tag"]');
    showDeleteButton = TestElement.byCss('#adf-remove-button-tag');
    showMoreButton = TestElement.byCss('button[data-automation-id="show-more-tags"]');
    showLessButton = TestElement.byCss('button[data-automation-id="show-fewer-tags"]');
    tagsOnPage = $$('div[class*="adf-list-tag"]');
    confirmTag = TestElement.byCss('#adf-tag-node-send');

    getNodeId(): Promise<string> {
        return BrowserActions.getInputValue(this.insertNodeIdElement);
    }

    async insertNodeId(nodeId) {
        await BrowserActions.clearSendKeys(this.insertNodeIdElement, nodeId);

        await browser.sleep(200);
        await this.insertNodeIdElement.sendKeys(' ');
        await browser.sleep(200);
        await this.insertNodeIdElement.sendKeys(protractor.Key.BACK_SPACE);
        await this.confirmTag.click();
    }

    async addTag(tag: string): Promise<void> {
        await this.newTagInput.typeText(tag);
        return this.addTagButton.click();
    }

    deleteTagFromTagListByNodeId(name: string): Promise<void> {
        return TestElement.byId('tag_chips_delete_' + name).click();
    }

    deleteTagFromTagList(name: string): Promise<void> {
        return TestElement.byId('tag_chips_delete_' + name).click();
    }

    async addTagButtonIsEnabled(): Promise<boolean> {
        await this.addTagButton.waitVisible();
        return this.addTagButton.isEnabled();
    }

    async checkTagIsDisplayedInTagList(tagName: string): Promise<boolean> {
        try {
            await TestElement.byText('div[id*="tag_name"]', tagName).waitVisible();
            return true;
        } catch (error) {
            if (await this.showMoreButton.isDisplayed()) {
                await this.showMoreButton.click();
                await this.checkTagIsDisplayedInTagList(tagName);
                return true;
            } else {
                throw new Error('Error');
            }
        }
    }

    async checkTagIsNotDisplayedInTagList(tagName: string): Promise<boolean> {
        try {
            await TestElement.byText('div[id*="tag_name"]', tagName).waitNotVisible();
            return true;
        } catch (error) {
            return false;
        }
    }

    checkTagIsNotDisplayedInTagListByNodeId(tagName: string): Promise<void> {
        return TestElement.byText('span[id*="tag_name"]', tagName).waitNotVisible();
    }

    checkTagIsDisplayedInTagListByNodeId(tagName: string): Promise<void> {
        return TestElement.byText('span[id*="tag_name"]', tagName).waitVisible();
    }

    checkDeleteTagFromTagListByNodeIdIsDisplayed(name: string): Promise<void> {
        return TestElement.byId('tag_chips_delete_' + name).waitVisible();
    }

    checkDeleteTagFromTagListByNodeIdIsNotDisplayed(name: string): Promise<void> {
        return TestElement.byId('tag_chips_delete_' + name).waitNotVisible();
    }
}
