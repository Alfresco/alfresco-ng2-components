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
    commentUserIcon = element(by.id('comment-user-icon'));
    commentUserName = element(by.id('comment-user'));
    commentMessage = element(by.id('comment-message'));
    commentTime = element(by.id('comment-time'));

    getTotalNumberOfComments() {
        Util.waitUntilElementIsVisible(this.numberOfComments);
        return this.numberOfComments.getText();
    }

    checkUserIconIsDisplayed() {
        Util.waitUntilElementIsVisible(this.commentUserIcon);
    }

    getUserName() {
        Util.waitUntilElementIsVisible(this.commentUserName);
        return this.commentUserName.getText();
    }

    getMessage() {
        Util.waitUntilElementIsVisible(this.commentMessage);
        return this.commentMessage.getText();
    }

    getTime() {
        Util.waitUntilElementIsVisible(this.commentTime);
        return this.commentTime.getText();
    }
}
