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
var UserProcessModel = /** @class */ (function () {
    function UserProcessModel(input) {
        if (input) {
            this.id = input.id;
            this.email = input.email || null;
            this.firstName = input.firstName || null;
            this.lastName = input.lastName || null;
            this.pictureId = input.pictureId || null;
            this.externalId = input.externalId || null;
        }
    }
    return UserProcessModel;
}());
exports.UserProcessModel = UserProcessModel;
//# sourceMappingURL=user-process.model.js.map