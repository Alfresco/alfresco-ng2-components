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
/* tslint:disable:component-selector  */
var moment_es6_1 = require("moment-es6");
var DateCellValidator = /** @class */ (function () {
    function DateCellValidator() {
        this.supportedTypes = [
            'Date'
        ];
    }
    DateCellValidator.prototype.isSupported = function (column) {
        return column && column.editable && this.supportedTypes.indexOf(column.type) > -1;
    };
    DateCellValidator.prototype.validate = function (row, column, summary) {
        if (this.isSupported(column)) {
            var value = row.value[column.id];
            if (!value && !column.required) {
                return true;
            }
            var dateValue = moment_es6_1.default(value, 'YYYY-MM-DDTHH:mm:ss.SSSSZ', true);
            if (!dateValue.isValid()) {
                if (summary) {
                    summary.isValid = false;
                    summary.message = "Invalid '" + column.name + "' format.";
                }
                return false;
            }
        }
        return true;
    };
    return DateCellValidator;
}());
exports.DateCellValidator = DateCellValidator;
//# sourceMappingURL=date-cell-validator-model.js.map