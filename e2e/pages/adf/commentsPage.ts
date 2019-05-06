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

import { element, by } from 'protractor';

import { TabsPage } from '@alfresco/adf-testing';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class CommentsPage {

    tabsPage = new TabsPage();
    numberOfComments = element(by.id('comment-header'));
    commentUserIcon = element.all(by.id('comment-user-icon'));
    commentUserName = element.all(by.id('comment-user'));
    commentMessage = element.all(by.id('comment-message'));
    commentTime = element.all(by.id('comment-time'));
    commentInput = element(by.id('comment-input'));
    addCommentButton = element(by.css("[data-automation-id='comments-input-add']"));

    getTotalNumberOfComments() {
        return BrowserActions.getText(this.numberOfComments);
    }

    checkUserIconIsDisplayed(position) {
        BrowserVisibility.waitUntilElementIsVisible(this.commentUserIcon.first());
        return this.commentUserIcon.get(position);
    }

    getUserName(position) {
        return BrowserActions.getText(this.commentUserName.get(position));
    }

    getMessage(position) {
        return BrowserActions.getText(this.commentMessage.get(position));

    }

    getTime(position) {
        return BrowserActions.getText(this.commentTime.get(position));
    }

    checkCommentInputIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.commentInput);
    }

    addComment(comment) {
        BrowserVisibility.waitUntilElementIsVisible(this.commentInput);
        this.commentInput.sendKeys(comment);
        BrowserActions.click(this.addCommentButton);
    }

    checkCommentsTabIsSelected() {
        this.tabsPage.checkTabIsSelectedByTitle('Comments');
    }

    checkCommentInputIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.commentInput);
    }
}
