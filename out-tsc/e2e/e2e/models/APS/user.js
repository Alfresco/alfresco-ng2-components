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
var adf_testing_1 = require("@alfresco/adf-testing");
/**
 * Create tenant JSON Object
 *
 * @param details - JSON object used to overwrite the default values
 * @constructor
 */
var User = /** @class */ (function () {
    function User(details) {
        this.email = adf_testing_1.StringUtil.generateRandomEmail('@activiti.test.com');
        this.firstName = adf_testing_1.StringUtil.generateRandomString();
        this.lastName = adf_testing_1.StringUtil.generateRandomString();
        this.password = adf_testing_1.StringUtil.generatePasswordString();
        this.type = 'enterprise';
        this.tenantId = '1';
        this.company = null;
        Object.assign(this, details);
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map