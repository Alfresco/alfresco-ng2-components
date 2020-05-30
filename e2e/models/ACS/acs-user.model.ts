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

import { StringUtil } from '@alfresco/adf-testing';

export class AcsUserModel {

    firstName = StringUtil.generateRandomString();
    lastName = StringUtil.generateRandomString();
    password = StringUtil.generateRandomString();
    email = StringUtil.generateRandomEmail('@alfresco.com');
    id = StringUtil.generateRandomString();

    constructor(details: any = {}) {
        this.email = details.email ? details.email : this.email;
        this.id = details.email ? details.email : this.email;

        this.firstName = details.firstName ? details.firstName :  this.firstName;
        this.lastName = details.lastName ? details.lastName :  this.lastName;
        this.password = details.password ? details.password : this.password;
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
