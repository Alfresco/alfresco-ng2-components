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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var MultiValuePipe = /** @class */ (function () {
    function MultiValuePipe() {
    }
    MultiValuePipe_1 = MultiValuePipe;
    MultiValuePipe.prototype.transform = function (values, valueSeparator) {
        if (valueSeparator === void 0) { valueSeparator = MultiValuePipe_1.DEFAULT_SEPARATOR; }
        if (values && values instanceof Array) {
            var valueList = values.map(function (value) { return value.trim(); });
            return valueList.join(valueSeparator);
        }
        return values;
    };
    var MultiValuePipe_1;
    MultiValuePipe.DEFAULT_SEPARATOR = ', ';
    MultiValuePipe = MultiValuePipe_1 = __decorate([
        core_1.Pipe({ name: 'multiValue' })
    ], MultiValuePipe);
    return MultiValuePipe;
}());
exports.MultiValuePipe = MultiValuePipe;
//# sourceMappingURL=multi-value.pipe.js.map