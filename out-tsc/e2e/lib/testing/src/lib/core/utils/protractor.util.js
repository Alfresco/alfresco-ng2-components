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
var protractor_1 = require("protractor");
/**
 * Tagged template to convert a sting to an `ElementFinder`.
 * @example ```const item = byCss`.adf-breadcrumb-item-current`;```
 * @example ```const item = byCss`${variable}`;```
 * @returns Instance of `ElementFinder` type.
 */
function byCss(literals) {
    var placeholders = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        placeholders[_i - 1] = arguments[_i];
    }
    var selector = literals[0] || placeholders[0];
    return protractor_1.browser.element(protractor_1.by.css(selector));
}
exports.byCss = byCss;
//# sourceMappingURL=protractor.util.js.map