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
var BpmUserModel = /** @class */ (function () {
    function BpmUserModel(input) {
        if (input) {
            this.apps = input.apps;
            this.capabilities = input.capabilities;
            this.company = input.company;
            this.created = input.created;
            this.email = input.email;
            this.externalId = input.externalId;
            this.firstName = input.firstName;
            this.lastName = input.lastName;
            this.fullname = input.fullname;
            this.groups = input.groups;
            this.id = input.id;
            this.lastUpdate = input.lastUpdate;
            this.latestSyncTimeStamp = input.latestSyncTimeStamp;
            this.password = input.password;
            this.pictureId = input.pictureId;
            this.status = input.status;
            this.tenantId = input.tenantId;
            this.tenantName = input.tenantName;
            this.tenantPictureId = input.tenantPictureId;
            this.type = input.type;
        }
    }
    return BpmUserModel;
}());
exports.BpmUserModel = BpmUserModel;
//# sourceMappingURL=bpm-user.model.js.map