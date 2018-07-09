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

var Util = require('../../util/util');

/**
 * Create User JSON Object
 *
 * @param details - JSON object used to overwrite the default values
 * @constructor
 */

var User = function (details) {

    this.email = Util.generateRandomEmail();
    this.firstName = Util.generateRandomString();
    this.lastName = Util.generateRandomString();
    this.password = Util.generatePasswordString();
    this.type = 'enterprise';
    this.tenantId = "1";
    this.company = null;

    Object.assign(this, details);
};
module.exports = User;
