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
var NumberCellValidator = /** @class */ (function () {
    function NumberCellValidator() {
        this.supportedTypes = [
            'Number',
            'Amount'
        ];
    }
    NumberCellValidator.prototype.isSupported = function (column) {
        return column && column.required && this.supportedTypes.indexOf(column.type) > -1;
    };
    NumberCellValidator.prototype.isNumber = function (value) {
        if (value === null || value === undefined || value === '') {
            return false;
        }
        return !isNaN(+value);
    };
    NumberCellValidator.prototype.validate = function (row, column, summary) {
        if (this.isSupported(column)) {
            var value = row.value[column.id];
            if (value === null ||
                value === undefined ||
                value === '' ||
                this.isNumber(value)) {
                return true;
            }
            if (summary) {
                summary.isValid = false;
                summary.message = "Field '" + column.name + "' must be a number.";
            }
            return false;
        }
        return true;
    };
    return NumberCellValidator;
}());
exports.NumberCellValidator = NumberCellValidator;
//# sourceMappingURL=number-cell-validator.model.js.map