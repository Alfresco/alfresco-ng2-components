"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var LoginSubmitEvent = (function () {
    function LoginSubmitEvent(_values) {
        this._defaultPrevented = false;
        this._values = _values;
    }
    Object.defineProperty(LoginSubmitEvent.prototype, "values", {
        get: function () {
            return this._values;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginSubmitEvent.prototype, "defaultPrevented", {
        get: function () {
            return this._defaultPrevented;
        },
        enumerable: true,
        configurable: true
    });
    LoginSubmitEvent.prototype.preventDefault = function () {
        this._defaultPrevented = true;
    };
    return LoginSubmitEvent;
}());
exports.LoginSubmitEvent = LoginSubmitEvent;
