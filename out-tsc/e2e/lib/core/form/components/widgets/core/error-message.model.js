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
var ErrorMessageModel = /** @class */ (function () {
    function ErrorMessageModel(obj) {
        this.message = '';
        this.attributes = null;
        this.message = obj && obj.message ? obj.message : '';
        this.attributes = new Map();
    }
    ErrorMessageModel.prototype.isActive = function () {
        return this.message ? true : false;
    };
    ErrorMessageModel.prototype.getAttributesAsJsonObj = function () {
        var result = {};
        if (this.attributes.size > 0) {
            var obj_1 = Object.create(null);
            this.attributes.forEach(function (value, key) {
                obj_1[key] = value;
            });
            result = JSON.stringify(obj_1);
        }
        return result;
    };
    return ErrorMessageModel;
}());
exports.ErrorMessageModel = ErrorMessageModel;
//# sourceMappingURL=error-message.model.js.map