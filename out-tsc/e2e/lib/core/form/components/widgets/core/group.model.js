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
var GroupModel = /** @class */ (function () {
    function GroupModel(json) {
        if (json) {
            this.externalId = json.externalId;
            this.groups = json.groups;
            this.id = json.id;
            this.name = json.name;
            this.status = json.status;
        }
    }
    return GroupModel;
}());
exports.GroupModel = GroupModel;
//# sourceMappingURL=group.model.js.map