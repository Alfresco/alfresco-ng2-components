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

import { Util } from '../../util/util';

export class AcsUserModel {

    firstName = Util.generateRandomString();
    lastName = Util.generateRandomString();
    password = Util.generateRandomString();
    email = Util.generateRandomString();
    id = Util.generateRandomString();
    jobTitle = 'N/A';

    constructor(details?: any) {
        Object.assign(this, details);
    }

    getFirstName = function () {
        return this.firstName;
    };

    getLastName = function () {
        return this.lastName;
    };

    getPassword = function () {
        return this.password;
    };

    getEmail = function () {
        return this.email;
    };

    getId = function () {
        return this.id;
    };

    getJobTitle = function () {
        return this.jobTitle;
    };

}
