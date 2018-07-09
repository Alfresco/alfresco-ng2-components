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

var AcsUserModel = function (details) {

    this.firstName = Util.generateRandomString();
    this.lastName = Util.generateRandomString();
    this.password = Util.generateRandomString();
    this.email = Util.generateRandomString();
    this.id = Util.generateRandomString();
    this.jobTitle = "N/A";

    this.getFirstName = function () {
        return this.firstName;
    };

    this.getLastName = function () {
        return this.lastName;
    };

    this.getPassword = function () {
        return this.password;
    };

    this.getEmail = function () {
        return this.email;
    };

    this.getId = function () {
        return this.id;
    };

    this.getJobTitle = function () {
        return this.jobTitle;
    };

    Object.assign(this, details);

};
module.exports = AcsUserModel;
