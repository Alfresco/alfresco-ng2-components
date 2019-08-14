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
var string_util_1 = require("../utils/string.util");
var protractor_1 = require("protractor");
var EMAIL_DOMAIN = protractor_1.browser.params.testConfig ? protractor_1.browser.params.testConfig.projectName : 'alfresco';
var UserModel = /** @class */ (function () {
    function UserModel(details) {
        this.firstName = string_util_1.StringUtil.generateRandomString();
        this.lastName = string_util_1.StringUtil.generateRandomString();
        this.password = string_util_1.StringUtil.generateRandomString();
        this.email = string_util_1.StringUtil.generateRandomEmail("@" + EMAIL_DOMAIN + ".com");
        this.username = string_util_1.StringUtil.generateRandomString().toLowerCase();
        Object.assign(this, details);
    }
    Object.defineProperty(UserModel.prototype, "id", {
        get: function () {
            return this.email;
        },
        enumerable: true,
        configurable: true
    });
    return UserModel;
}());
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map