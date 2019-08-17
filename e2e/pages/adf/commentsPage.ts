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

import { element, by, ElementFinder, ElementArrayFinder } from 'protractor';

import { TabsPage } from '@alfresco/adf-testing';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class CommentsPage {

    tabsPage: TabsPage = new TabsPage();
    numberOfComments: ElementFinder = element(by.id('comment-header'));
    commentUserIcon: ElementArrayFinder = element.all(by.id('comment-user-icon'));
    commentUserName: ElementArrayFinder = element.all(by.id('comment-user'));
    commentMessage: ElementArrayFinder = element.all(by.id('comment-message'));
    commentTime: ElementArrayFinder = element.all(by.id('comment-time'));
    commentInput: ElementFinder = element(by.id('comment-input'));
    addCommentButton: ElementFinder = element(by.css("[data-automation-id='comments-input-add']"));

    async getTotalNumberOfComments(): Promise<string> {
        return BrowserActions.getText(this.numberOfComments);
    }

    async checkUserIconIsDisplayed(position): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.commentUserIcon.first());
    }

    getUserName(position): Promise<string> {
        return BrowserActions.getText(this.commentUserName.get(position));
    }

    getMessage(position): Promise<string> {
        return BrowserActions.getText(this.commentMessage.get(position));

    }

    getTime(position): Promise<string> {
        return BrowserActions.getText(this.commentTime.get(position));
    }

    async checkCommentInputIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.commentInput);
    }

    async addComment(comment): Promise<void> {
        await BrowserActions.clearSendKeys(this.commentInput, comment);
        await BrowserActions.click(this.addCommentButton);
    }

    async checkCommentsTabIsSelected(): Promise<void> {
        await this.tabsPage.checkTabIsSelectedByTitle('Comments');
    }

    async checkCommentInputIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.commentInput);
    }
}
