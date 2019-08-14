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
var IdentityUserModel = /** @class */ (function () {
    function IdentityUserModel(obj) {
        if (obj) {
            this.id = obj.id || null;
            this.firstName = obj.firstName || null;
            this.lastName = obj.lastName || null;
            this.email = obj.email || null;
            this.username = obj.username || null;
            this.createdTimestamp = obj.createdTimestamp || null;
            this.emailVerified = obj.emailVerified || null;
            this.enabled = obj.enabled || null;
        }
    }
    return IdentityUserModel;
}());
exports.IdentityUserModel = IdentityUserModel;
var IdentityUserPasswordModel = /** @class */ (function () {
    function IdentityUserPasswordModel(obj) {
        if (obj) {
            this.type = obj.type;
            this.value = obj.value;
            this.temporary = obj.temporary;
        }
    }
    return IdentityUserPasswordModel;
}());
exports.IdentityUserPasswordModel = IdentityUserPasswordModel;
var IdentityUserQueryCloudRequestModel = /** @class */ (function () {
    function IdentityUserQueryCloudRequestModel(obj) {
        if (obj) {
            this.first = obj.first;
            this.max = obj.max;
        }
    }
    return IdentityUserQueryCloudRequestModel;
}());
exports.IdentityUserQueryCloudRequestModel = IdentityUserQueryCloudRequestModel;
var IdentityJoinGroupRequestModel = /** @class */ (function () {
    function IdentityJoinGroupRequestModel(obj) {
        if (obj) {
            this.realm = obj.realm;
            this.userId = obj.userId;
            this.groupId = obj.groupId;
        }
    }
    return IdentityJoinGroupRequestModel;
}());
exports.IdentityJoinGroupRequestModel = IdentityJoinGroupRequestModel;
//# sourceMappingURL=identity-user.model.js.map