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

import Util = require('../../util/util');
import TestConfig = require('../../test.config');

export class CommentsPage {

    numberOfComments = element(by.id('comment-header'));
    commentUserIcon = element.all(by.id('comment-user-icon'));
    commentUserName = element.all(by.id('comment-user'));
    commentMessage = element.all(by.id('comment-message'));
    commentTime = element.all(by.id('comment-time'));
    commentInput = element(by.id('comment-input'));

    getTotalNumberOfComments() {
        Util.waitUntilElementIsVisible(this.numberOfComments);
        return this.numberOfComments.getText();
    }

    checkUserIconIsDisplayed(number) {
        Util.waitUntilElementIsVisible(this.commentUserIcon);
        return this.commentUserIcon.get(number);
    }

    getUserName(number) {
        Util.waitUntilElementIsVisible(this.commentUserName);
        return this.commentUserName.get(number).getText();
    }

    getMessage(number) {
        Util.waitUntilElementIsVisible(this.commentMessage);
        return this.commentMessage.get(number).getText();
    }

    getTime(number) {
        Util.waitUntilElementIsVisible(this.commentTime);
        return this.commentTime.get(number).getText();
    }

    checkCommentInputIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.commentInput);
    }
}
