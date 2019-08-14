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
var FormOutcomeEvent = /** @class */ (function () {
    function FormOutcomeEvent(outcome) {
        this._defaultPrevented = false;
        this._outcome = outcome;
    }
    Object.defineProperty(FormOutcomeEvent.prototype, "outcome", {
        get: function () {
            return this._outcome;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormOutcomeEvent.prototype, "defaultPrevented", {
        get: function () {
            return this._defaultPrevented;
        },
        enumerable: true,
        configurable: true
    });
    FormOutcomeEvent.prototype.preventDefault = function () {
        this._defaultPrevented = true;
    };
    return FormOutcomeEvent;
}());
exports.FormOutcomeEvent = FormOutcomeEvent;
//# sourceMappingURL=form-outcome-event.model.js.map