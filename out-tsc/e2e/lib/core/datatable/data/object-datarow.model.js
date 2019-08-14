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
var utils_1 = require("../../utils");
// Simple implementation of the DataRow interface.
var ObjectDataRow = /** @class */ (function () {
    function ObjectDataRow(obj, isSelected) {
        if (isSelected === void 0) { isSelected = false; }
        this.obj = obj;
        this.isSelected = isSelected;
        if (!obj) {
            throw new Error('Object source not found');
        }
    }
    ObjectDataRow.prototype.getValue = function (key) {
        return utils_1.ObjectUtils.getValue(this.obj, key);
    };
    ObjectDataRow.prototype.hasValue = function (key) {
        return this.getValue(key) !== undefined;
    };
    ObjectDataRow.prototype.imageErrorResolver = function (event) {
        return '';
    };
    return ObjectDataRow;
}());
exports.ObjectDataRow = ObjectDataRow;
//# sourceMappingURL=object-datarow.model.js.map