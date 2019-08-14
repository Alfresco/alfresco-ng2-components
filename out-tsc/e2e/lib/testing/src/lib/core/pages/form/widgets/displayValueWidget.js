"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var formFields_1 = require("../formFields");
var protractor_1 = require("protractor");
var DisplayValueWidget = /** @class */ (function () {
    function DisplayValueWidget() {
        this.formFields = new formFields_1.FormFields();
        this.labelLocator = protractor_1.by.css("label[class*='adf-label']");
        this.inputLocator = protractor_1.by.css('input');
    }
    DisplayValueWidget.prototype.getFieldLabel = function (fieldId) {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    };
    DisplayValueWidget.prototype.getFieldValue = function (fieldId) {
        return this.formFields.getFieldValue(fieldId, this.inputLocator);
    };
    return DisplayValueWidget;
}());
exports.DisplayValueWidget = DisplayValueWidget;
//# sourceMappingURL=displayValueWidget.js.map