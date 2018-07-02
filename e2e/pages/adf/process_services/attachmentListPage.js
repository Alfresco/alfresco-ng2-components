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

var Util = require('../../../util/util');
var TestConfig = require('../../../test.config');
var path = require('path');

var AttachmentListPage = function () {

    var attachFileButton = element(by.css("input[type='file']"));

    this.clickAttachFileButton = function (fileLocation) {
        Util.waitUntilElementIsVisible(attachFileButton);
        attachFileButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, fileLocation)));
    };

    this.checkFileIsAttached = function (name) {
        var fileAttached = element.all(by.css('div[filename="'+name+'"]')).first();
        Util.waitUntilElementIsVisible(fileAttached);

    };

    this.checkAttachFileButtonIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(attachFileButton);
    };

};
module.exports = AttachmentListPage;
