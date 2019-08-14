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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var form_field_event_1 = require("./form-field.event");
var ValidateDynamicTableRowEvent = /** @class */ (function (_super) {
    __extends(ValidateDynamicTableRowEvent, _super);
    function ValidateDynamicTableRowEvent(form, field, row, summary) {
        var _this = _super.call(this, form, field) || this;
        _this.row = row;
        _this.summary = summary;
        _this.isValid = true;
        return _this;
    }
    return ValidateDynamicTableRowEvent;
}(form_field_event_1.FormFieldEvent));
exports.ValidateDynamicTableRowEvent = ValidateDynamicTableRowEvent;
//# sourceMappingURL=validate-dynamic-table-row.event.js.map